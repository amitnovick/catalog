import React from 'react';
import { connect } from 'react-redux';
import { interpret } from 'xstate';
import { useService } from '@xstate/react';

import LoadUserFilesScreen from '../LoadUserFilesScreen/LoadUserFilesScreen';
import configFileMachine from './configFileMachine';
import store from '../../redux/store';
import { RECEIVE_ENTITIES } from '../actionTypes';
import DisabledUserFilesPathForm from './components/DisabledUerFilesPathForm';
import { Header, Button } from 'semantic-ui-react';
const fs = require('fs');
const path = require('path');
import { ipcRenderer } from 'electron';
import EnabledUserFilesPathFormContainer from './containers/EnabledUserFilesPathFormContainer';

ipcRenderer.on('eventFromMain', (_, arg) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      appDataPath: arg.userDataPath,
    },
  });
  service.send('RECEIVE_APP_DATA_PATH');
});

const CONFIG_FILE_NAME = 'config.json';

const CONFIG_FILE_KEY = 'userFilesPath';

const getAppDataPath = (store) =>
  store && store.startupScreen ? store.startupScreen.appDataPath : '';

const attemptToReadConfigFile = () => {
  return new Promise((resolve, reject) => {
    const appDataPath = getAppDataPath(store.getState());
    const configFilePath = path.join(appDataPath, CONFIG_FILE_NAME);
    fs.readFile(configFilePath, 'utf8', (err, data) => {
      if (err) {
        reject();
      } else {
        const parsedData = JSON.parse(data);
        const { [CONFIG_FILE_KEY]: userFilesPath } = parsedData;
        store.dispatch({
          type: RECEIVE_ENTITIES,
          payload: {
            userFilesPath: userFilesPath,
          },
        });
        resolve();
      }
    });
  });
};

const writeUserFilesPathToConfigFile = () => {
  return new Promise((resolve, reject) => {
    const appDataPath = getAppDataPath(store.getState());
    const configFilePath = path.join(appDataPath, CONFIG_FILE_NAME);
    const userFilesPath = getUserFilesPath(store.getState());
    const configFileContent = JSON.stringify({
      [CONFIG_FILE_KEY]: userFilesPath,
    });
    fs.writeFile(configFilePath, configFileContent, (err) => {
      if (err) {
        store.dispatch({
          type: RECEIVE_ENTITIES,
          payload: {
            configScreenErrorMessage: `Couldn't write to file at: ${configFilePath}`,
          },
        });
        reject();
      } else {
        resolve();
      }
    });
  });
};

const getUserFilesPath = (store) =>
  store && store.startupScreen ? store.startupScreen.userFilesPath : '';

const DIR_NOT_EXIST_ERROR_CODE = 'ENOENT';

const checkUserFilesDirExists = () => {
  return new Promise((resolve, reject) => {
    const userFilesPath = getUserFilesPath(store.getState());
    fs.access(userFilesPath, function(err) {
      if (err) {
        if (err.code === DIR_NOT_EXIST_ERROR_CODE) {
          store.dispatch({
            type: RECEIVE_ENTITIES,
            payload: {
              configScreenErrorMessage: `Directory at ${userFilesPath} is missing`,
            },
          });
        } else {
          store.dispatch({
            type: RECEIVE_ENTITIES,
            payload: {
              configScreenErrorMessage: `Unknown error while accessing directory at: ${userFilesPath}`,
            },
          });
        }
        reject();
      } else {
        resolve();
      }
    });
  });
};

const configFileMachineConfigured = configFileMachine.withConfig({
  actions: {
    sendEventToMainProcess: (_, __) => ipcRenderer.send('eventFromRenderer'),
  },
  services: {
    attemptToReadConfigFile: (_, __) => attemptToReadConfigFile(),
    writeUserFilesPathToConfigFile: (_, __) => writeUserFilesPathToConfigFile(),
    checkUserFilesDirExists: (_, __) => checkUserFilesDirExists(),
  },
});

const service = interpret(configFileMachineConfigured).start();

const LoadConfigFileScreen = ({ configScreenErrorMessage }) => {
  const [current, send] = useService(service);
  if (
    current.matches('fetchingAppDataPath') ||
    current.matches('attemptingToReadConfigFile') ||
    current.matches('checkingUserFilesDirExists')
  ) {
    return <h2>Loading...</h2>;
  } else if (current.matches('configFileDoesntExist')) {
    if (current.matches('configFileDoesntExist.askingForUserFilesPath.submitButtonDisabled')) {
      return (
        <DisabledUserFilesPathForm
          onInput={(directoryPath) => {
            store.dispatch({
              type: RECEIVE_ENTITIES,
              payload: {
                userFilesPath: directoryPath,
              },
            });
            send('INPUT_DIRECTORY_PATH');
          }}
        />
      );
    } else if (
      current.matches('configFileDoesntExist.askingForUserFilesPath.submitButtonEnabled')
    ) {
      return (
        <EnabledUserFilesPathFormContainer
          onInput={(directoryPath) => {
            store.dispatch({
              type: RECEIVE_ENTITIES,
              payload: {
                userFilesPath: directoryPath,
              },
            });
          }}
          onSubmit={() => send('CLICK_SUBMIT_DIRECTORY_PATH_BUTTON')}
        />
      );
    } else if (current.matches('configFileDoesntExist.writingUserFilesPathToConfigFile')) {
      return <h2>Loading...</h2>;
    } else {
      return <h2>Unknown state</h2>;
    }
  } else if (current.matches('finished')) {
    return <LoadUserFilesScreen />;
  } else if (current.matches('userFilesDirDoesntExistError')) {
    return (
      <>
        <Header as="h1">Failed due to error:</Header>
        <Header as="h2">{configScreenErrorMessage}</Header>
        <Button size="massive" onClick={() => send('CLICK_PROVIDE_DIFFERENT_DIRECTORY')}>
          Provide different directory
        </Button>
      </>
    );
  } else if (current.matches('couldntWriteToConfigFileError')) {
    return (
      <>
        <Header as="h1">Failed due to error:</Header>
        <Header as="h2">{configScreenErrorMessage}</Header>
      </>
    );
  } else {
    return <h2>Unknown state</h2>;
  }
};

const getConfigScreenErrorMessage = (store) =>
  store && store.startupScreen ? store.startupScreen.configScreenErrorMessage : '';

const LoadConfigFileScreenContainer = connect((state) => ({
  configScreenErrorMessage: getConfigScreenErrorMessage(state),
}))(LoadConfigFileScreen);

export default LoadConfigFileScreenContainer;
