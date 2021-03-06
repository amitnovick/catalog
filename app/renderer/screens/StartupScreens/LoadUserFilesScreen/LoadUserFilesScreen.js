import React from 'react';
import { withRouter } from 'react-router-dom';
import machine from './machine';
import { useMachine } from '@xstate/react';
import { connect } from 'react-redux';

import store from '../../../redux/store';
import {
  USER_FILES_DIR,
  USER_FILES_SUBDIR_FILES_NAME,
  SQLITE_FILE_NAME,
} from './userFilesConfigurationConstants';
import writeDirIfNotExists from '../../../fs/writeDirIfNotExists';
import writeFileIfNotExist from '../../../fs/writeFileIfNotExists';
import { RECEIVE_ENTITIES } from '../actionTypes';
import routes from '../../../routes';
import buildSchema from '../../../db/buildSchema';

const fs = require('fs');
const path = require('path');

const getChosenInstancePath = (store) =>
  store && store.startupScreen ? store.startupScreen.chosenInstancePath : '';

const writeUserFilesDirIfNotExists = async () => {
  const chosenInstancePath = getChosenInstancePath(store.getState());
  const chosenInstanceSubdirPath = path.join(chosenInstancePath, USER_FILES_DIR);
  return await writeDirIfNotExists(chosenInstanceSubdirPath);
};

const writeFilesSubdirIfNotExists = async () => {
  const chosenInstancePath = getChosenInstancePath(store.getState());
  const userFilesDirPath = path.join(
    chosenInstancePath,
    USER_FILES_DIR,
    USER_FILES_SUBDIR_FILES_NAME,
  );
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      userFilesSubdirFilesPath: userFilesDirPath,
    },
  });
  return await writeDirIfNotExists(userFilesDirPath);
};

const writeSqliteFileAndInitializingIfNotExists = async () => {
  const chosenInstancePath = getChosenInstancePath(store.getState());
  const sqliteFilePath = path.join(chosenInstancePath, USER_FILES_DIR, SQLITE_FILE_NAME);
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      sqliteFilePath: sqliteFilePath,
    },
  });

  try {
    await writeFileIfNotExist(sqliteFilePath);
  } catch (error) {
    if (error.code !== 'EEXIST') {
      return Promise.reject(error);
    }
  }

  return await buildSchema();
};

const updateErrorMessage = (errorMessage) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      loadUserFilesErrorMessage: errorMessage,
    },
  });
};

const DIR_NOT_EXIST_ERROR_CODE = 'ENOENT';

const checkUserFilesDirExists = () => {
  return new Promise((resolve, reject) => {
    const chosenInstancePath = getChosenInstancePath(store.getState());
    fs.access(chosenInstancePath, function(err) {
      if (err) {
        if (err.code === DIR_NOT_EXIST_ERROR_CODE) {
          reject(`Directory at ${chosenInstancePath} is missing`);
        } else {
          reject(`Unknown error while accessing directory at: ${chosenInstancePath}`);
        }
      } else {
        resolve();
      }
    });
  });
};

const machineWithConfig = machine.withConfig({
  services: {
    checkUserFilesDirExists: () => checkUserFilesDirExists(),
    writeUserFilesDirIfNotExists: () => writeUserFilesDirIfNotExists(),
    writeFilesSubdirIfNotExists: () => writeFilesSubdirIfNotExists(),
    writeSqliteFileAndInitializingIfNotExists: () => writeSqliteFileAndInitializingIfNotExists(),
  },
  actions: {
    updateErrorMessage: (_, event) => updateErrorMessage(event.data.message),
  },
});

const LoadUserFilesScreen = ({ loadUserFilesErrorMessage, history }) => {
  const [current] = useMachine(
    machineWithConfig.withConfig({
      actions: {
        navigateToHomeScreen: (_, __) => history.push(routes.HOME),
      },
    }),
    { devTools: true },
  );
  if (
    current.matches('checkingUserFilesDirExists') ||
    current.matches('writingUserFilesDirIfNotExists') ||
    current.matches('writingFilesSubdirIfNotExists') ||
    current.matches('writingSqliteFileAndInitializingIfNotExists')
  ) {
    return <h2>Loading...</h2>;
  } else if (current.matches('failure')) {
    return (
      <>
        <h1>Failed due to error</h1>
        <h2>{loadUserFilesErrorMessage}</h2>
      </>
    );
  } else {
    return <h2>Unknown state</h2>;
  }
};

const getLoadUserFilesErrorMessage = (store) =>
  store && store.startupScreen ? store.startupScreen.loadUserFilesErrorMessage : '';

export default withRouter(
  connect((state) => ({
    loadUserFilesErrorMessage: getLoadUserFilesErrorMessage(state),
  }))(LoadUserFilesScreen),
);
