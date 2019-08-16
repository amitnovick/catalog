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
import readJSONfile from '../../../fs/readJSONfile';
const fs = require('fs');
const path = require('path');

const attemptToReadConfigFile = async () => {
  const configDirectoryPath = remote.app.getPath('userData');
  const configFilePath = path.join(configDirectoryPath, CONFIG_FILE_NAME);
  try {
    const parsedData = await readJSONfile(configFilePath);
    const { [CONFIG_FILE_KEY]: instancesPaths } = parsedData;
    const resolvedValue = {
      instancesPaths,
      configDirectoryPath,
    };
    return Promise.resolve(resolvedValue);
  } catch (error) {
    const rejectedValue = {
      configDirectoryPath,
    };
    return Promise.reject(rejectedValue);
  }
};

const getConfigDirectoryPath = (store) =>
  store && store.startupScreen ? store.startupScreen.configDirectoryPath : '';

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
        const resolvedValue = { instancesPaths };
        resolve(resolvedValue);
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
    updateInstancesPaths: (_, event) => updateInstancesPaths(event.data.instancesPaths),
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
