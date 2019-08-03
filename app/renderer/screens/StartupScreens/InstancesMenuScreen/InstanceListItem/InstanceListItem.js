import React from 'react';
import { css } from 'emotion';
import { connect } from 'react-redux';
import { List, Button, Icon } from 'semantic-ui-react';
import machine from './machine';
import { useMachine } from '@xstate/react';
import store from '../../../../redux/store';
import { RECEIVE_ENTITIES } from '../../actionTypes';
import { CONFIG_FILE_KEY, CONFIG_FILE_NAME } from '../../configConstants';
const fs = require('fs');
const path = require('path');

const centerInParentStyle = {
  display: 'flex',
  justifyContent: 'center', // Center horizontally inside parent container
  alignItems: 'center', // Center vertically inside parent container
};

const childDivClass = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 50px;
`;

const topRightCornerClass = css`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const parentDivClass = css`
  position: relative;
  width: 100%;
  height: 150px;
  border: 1px solid black;
`;

const getInstancesPaths = (store) =>
  store && store.startupScreen ? store.startupScreen.instancesPaths : [];

const getConfigDirectoryPath = (store) =>
  store && store.startupScreen ? store.startupScreen.configDirectoryPath : '';

const writeToConfigFile = (instancePath) => {
  return new Promise((resolve, reject) => {
    const configDirectoryPath = getConfigDirectoryPath(store.getState());
    const configFilePath = path.join(configDirectoryPath, CONFIG_FILE_NAME);
    const instancesPaths = getInstancesPaths(store.getState());
    const newInstancesPaths = instancesPaths.filter(
      (existingInstancePath) => existingInstancePath !== instancePath,
    );
    const configFileContent = JSON.stringify({
      [CONFIG_FILE_KEY]: newInstancesPaths,
    });
    fs.writeFile(configFilePath, configFileContent, (err) => {
      if (err) {
        const errorMessage = `Couldn't write to file at: ${configDirectoryPath}`;
        reject(errorMessage);
      } else {
        resolve(newInstancesPaths);
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

const machineWithConfig = machine.withConfig({
  services: {
    writeToConfigFile: (_, event) => writeToConfigFile(event.instancePath),
  },
  actions: {
    updateInstancesPaths: (_, event) => updateInstancesPaths(event.data),
  },
});

const InstanceListItem = ({ instancePath, onClickInstancePath }) => {
  const [current, send] = useMachine(machineWithConfig);
  const onClickRemove = () => send('CLICK_REMOVE_INSTANCE', { instancePath: instancePath });
  return (
    <List.Item className={parentDivClass}>
      <Button
        className={topRightCornerClass}
        icon
        size="massive"
        color="red"
        disabled={!current.matches('idle')}
        onClick={() => onClickRemove(instancePath)}>
        <Icon name="remove" />
      </Button>
      <div className={childDivClass} style={centerInParentStyle}>
        <Button size="massive" color="blue" onClick={() => onClickInstancePath(instancePath)}>
          {instancePath}
        </Button>
      </div>
    </List.Item>
  );
};

export default connect()(InstanceListItem);
