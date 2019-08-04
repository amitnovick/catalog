import React from 'react';
import { connect } from 'react-redux';
import { useMachine } from '@xstate/react';

import machine from './machine';
import store from '../../../redux/store';
import { RECEIVE_ENTITIES } from '../actionTypes';
import { Header } from 'semantic-ui-react';
import { remote } from 'electron';
import InstancesMenuScreen from '../InstancesMenuScreen/InstancesMenuScreen';
import { CONFIG_FILE_KEY, CONFIG_FILE_NAME } from '../configConstants';
const fs = require('fs');
const path = require('path');

const getConfigDirectoryPath = (store) =>
  store && store.startupScreen ? store.startupScreen.configDirectoryPath : '';

const attemptToReadConfigFile = () => {
  return new Promise((resolve, reject) => {
    const configDirectoryPath = remote.app.getPath('userData');
    // const configDirectoryPath = getConfigDirectoryPath(store.getState());
    const configFilePath = path.join(configDirectoryPath, CONFIG_FILE_NAME);
    fs.readFile(configFilePath, 'utf8', (err, data) => {
      if (err) {
        const rejectedValue = {
          configDirectoryPath,
        };
        reject(rejectedValue);
      } else {
        const parsedData = JSON.parse(data);
        const { [CONFIG_FILE_KEY]: instancesPaths } = parsedData;
        const resolvedValue = {
          instancesPaths,
          configDirectoryPath,
        };
        resolve(resolvedValue);
      }
    });
  });
};

const writeDefaultConfigFile = () => {
  return new Promise((resolve, reject) => {
    const configDirectoryPath = getConfigDirectoryPath(store.getState());
    const configFilePath = path.join(configDirectoryPath, CONFIG_FILE_NAME);
    const instancesPaths = [];
    const configFileContent = JSON.stringify({
      [CONFIG_FILE_KEY]: instancesPaths,
    });
    fs.writeFile(configFilePath, configFileContent, (err) => {
      if (err) {
        const errorMessage = `Couldn't write to file at: ${configDirectoryPath}`;
        reject(errorMessage);
      } else {
        resolve(instancesPaths);
      }
    });
  });
};

const updateInstancesPaths = (instancesPaths) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      instancesPaths: instancesPaths,
    },
  });
};

const updateErrorMessage = (errorMessage) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      configScreenErrorMessage: errorMessage,
    },
  });
};

const updateConfigDirectoryPath = (configDirectoryPath) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      configDirectoryPath: configDirectoryPath,
    },
  });
};

const configFileMachineConfigured = machine.withConfig({
  actions: {
    updateInstancesPaths: (_, event) => updateInstancesPaths(event.data),
    updateErrorMessage: (_, event) => updateErrorMessage(event.data),
    updateConfigDirectoryPath: (_, event) =>
      updateConfigDirectoryPath(event.data.configDirectoryPath),
  },
  services: {
    attemptToReadConfigFile: (_, __) => attemptToReadConfigFile(),
    writeDefaultConfigFile: (_, __) => writeDefaultConfigFile(),
  },
});

const LoadConfigFileScreen = ({ configScreenErrorMessage }) => {
  const [current] = useMachine(configFileMachineConfigured);
  if (
    current.matches('attemptingToReadConfigFile') ||
    current.matches('writingDefaultConfigFile')
  ) {
    return <h2>Loading...</h2>;
  } else if (current.matches('finished')) {
    return <InstancesMenuScreen />;
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
