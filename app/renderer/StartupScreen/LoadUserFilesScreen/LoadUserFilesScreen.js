import React from 'react';
import RouteController from '../../RouteController';
import machine from './machine';
import { useMachine } from '@xstate/react';
import store from '../../redux/store';
import {
  USER_FILES_DIR,
  USER_FILES_SUBDIR_FILES_NAME,
  SQLITE_FILE_NAME,
} from './userFilesConfigurationConstants';
import writeDirIfNotExists from '../../utils/writeDirIfNotExists';
import writeFileIfNotExist from '../../utils/writeFileIfNotExists';
import {
  createFilesTableIfNotExists,
  createCategoriesTableIfNotExists,
  createCategoriesFilesTableIfNotExists,
  insertRootCategoryIfNotExists,
} from './sqlQueries';
import { RECEIVE_ENTITIES } from '../actionTypes';
const path = require('path');
const sqlite3 = require('sqlite3');

const getUserFilesPath = (store) =>
  store && store.startupScreen ? store.startupScreen.userFilesPath : '';

const writeUserFilesDirIfNotExists = async () => {
  const userFilesPath = getUserFilesPath(store.getState());
  const userFilesDirPath = path.join(userFilesPath, USER_FILES_DIR);
  return await writeDirIfNotExists(userFilesDirPath);
};

const writeFilesSubdirIfNotExists = async () => {
  const userFilesPath = getUserFilesPath(store.getState());
  const userFilesDirPath = path.join(userFilesPath, USER_FILES_DIR, USER_FILES_SUBDIR_FILES_NAME);
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      userFilesSubdirFilesPath: userFilesDirPath,
    },
  });
  return await writeDirIfNotExists(userFilesDirPath);
};

const initializeDatabaseIfNotInitialized = (sqliteFilePath) => {
  return new Promise((resolve, reject) => {
    const sqlDriver = new sqlite3.Database(sqliteFilePath);
    sqlDriver.serialize(function() {
      sqlDriver.run(createFilesTableIfNotExists, function(err) {
        if (err) {
          reject();
        }
      });
      sqlDriver.run(createCategoriesTableIfNotExists, function(err) {
        if (err) {
          reject();
        }
      });
      sqlDriver.run(createCategoriesFilesTableIfNotExists, function(err) {
        if (err) {
          reject();
        }
      });
      sqlDriver.run(insertRootCategoryIfNotExists, {}, function(err) {
        if (err) {
          reject();
        } else {
          resolve();
        }
      });
    });
  });
};

const writeSqliteFileAndInitializingIfNotExists = async () => {
  const userFilesPath = getUserFilesPath(store.getState());
  const sqliteFilePath = path.join(userFilesPath, USER_FILES_DIR, SQLITE_FILE_NAME);
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      sqliteFilePath: sqliteFilePath,
    },
  });

  try {
    await writeFileIfNotExist(sqliteFilePath);
  } catch (error) {
    if (error) {
      return Promise.reject();
    }
  }
  return await initializeDatabaseIfNotInitialized(sqliteFilePath);
};

const machineWithConfig = machine.withConfig({
  services: {
    writeUserFilesDirIfNotExists: () => writeUserFilesDirIfNotExists(),
    writeFilesSubdirIfNotExists: () => writeFilesSubdirIfNotExists(),
    writeSqliteFileAndInitializingIfNotExists: () => writeSqliteFileAndInitializingIfNotExists(),
  },
});

const LoadUserFilesScreen = () => {
  const [current] = useMachine(machineWithConfig);
  if (
    current.matches('writingUserFilesDirIfNotExists') ||
    current.matches('writingFilesSubdirIfNotExists') ||
    current.matches('writingSqliteFileAndInitializingIfNotExists')
  ) {
    return <h2>Loading...</h2>;
  } else if (current.matches('finished')) {
    return <RouteController />;
  } else if (current.matches('failure')) {
    return <h2>Failed due to error</h2>;
  } else {
    return <h2>Unknown state</h2>;
  }
};

export default LoadUserFilesScreen;
