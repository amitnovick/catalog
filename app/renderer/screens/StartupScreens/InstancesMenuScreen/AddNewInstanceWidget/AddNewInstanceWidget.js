import React from 'react';
import machine from './machine';
import { connect } from 'react-redux';
import { useMachine } from '@xstate/react';
import { Header, Button } from 'semantic-ui-react';

import store from '../../../../redux/store';
import { RECEIVE_ENTITIES } from '../../actionTypes';
import { CONFIG_FILE_KEY, CONFIG_FILE_NAME } from '../../configConstants';
import AddNewInstanceContainer from './AddNewInstanceContainer';
const fs = require('fs');
const path = require('path');

const getConfigDirectoryPath = (store) =>
  store && store.startupScreen ? store.startupScreen.configDirectoryPath : '';

const updateInstancesPaths = (instancesPaths) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      instancesPaths: instancesPaths,
    },
  });
};

const getInstancesPaths = (store) =>
  store && store.startupScreen ? store.startupScreen.instancesPaths : [];

const writeNewInstancesToConfigFile = (instancesPaths) => {
  return new Promise((resolve, reject) => {
    const configDirectoryPath = getConfigDirectoryPath(store.getState());
    const configFilePath = path.join(configDirectoryPath, CONFIG_FILE_NAME);
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

const writeNewInstanceToConfigFile = (instancePath) => {
  const instancesPaths = getInstancesPaths(store.getState());
  if (instancesPaths.includes(instancePath)) {
    return Promise.reject('There is already an instance with this path');
  } else {
    const newInstancesPaths = [instancePath, ...instancesPaths];
    return writeNewInstancesToConfigFile(newInstancesPaths);
  }
};

const updateErrorMessage = (errorMessage) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      addNewInstanceErrorMessage: errorMessage,
    },
  });
};

const resetInputPath = () => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      inputPath: '',
    },
  });
};

const machineWithConfig = machine.withConfig({
  actions: {
    updateInstancesPaths: (_, event) => updateInstancesPaths(event.data),
    updateErrorMessage: (_, event) => updateErrorMessage(event.data),
    resetInputPath: (_, __) => resetInputPath(),
  },
  services: {
    writeNewInstanceToConfigFile: (_, event) => writeNewInstanceToConfigFile(event.instancePath),
  },
});

const AddNewInstanceWidget = ({ addNewInstanceErrorMessage }) => {
  const [current, send] = useMachine(machineWithConfig, { devTools: true });

  if (current.matches('idle')) {
    return (
      <AddNewInstanceContainer
        onSubmit={(instancePath) => {
          send('CLICK_SUBMIT_NEW_INSTANCE', { instancePath: instancePath });
        }}
      />
    );
  } else if (current.matches('writingNewInstanceToConfigFile')) {
    return <h2>Loading...</h2>;
  } else if (current.matches('couldntWriteToFileError')) {
    return (
      <>
        <Header as="h1">Error occurred:</Header>
        <Header as="h2">{addNewInstanceErrorMessage}</Header>
        <Button onClick={() => send('CLICK_RETRY')}>Retry</Button>
      </>
    );
  } else {
    return <h2>Unknown state</h2>;
  }
};

const getAddNewInstanceErrorMessage = (store) =>
  store && store.startupScreen ? store.startupScreen.addNewInstanceErrorMessage : '';

export default connect((state) => ({
  addNewInstanceErrorMessage: getAddNewInstanceErrorMessage(state),
}))(AddNewInstanceWidget);
