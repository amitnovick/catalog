import React from 'react';
import { connect } from 'react-redux';
import { List, Header } from 'semantic-ui-react';
import AddNewInstanceSection from './AddNewInstanceSection/AddNewInstanceSection';
import InstanceListItem from './InstanceListItem/InstanceListItem';
import { RECEIVE_ENTITIES } from '../actionTypes';
import LoadUserFilesScreen from '../LoadUserFilesScreen/LoadUserFilesScreen';

const InstancesMenuScreen = ({ instancesPaths, updateChosenInstancePath }) => {
  const [isFinished, setIsFinished] = React.useState(false);
  if (isFinished) {
    return <LoadUserFilesScreen />;
  } else {
    return (
      <>
        <Header as="h1" textAlign="center">
          {instancesPaths.length > 0 ? 'Choose instance' : 'No instances yet'}
        </Header>
        <List>
          {instancesPaths.map((instancePath) => (
            <InstanceListItem
              key={instancePath}
              instancePath={instancePath}
              onClickInstancePath={(instancePath) => {
                updateChosenInstancePath(instancePath);
                setIsFinished(true);
              }}
            />
          ))}
          <List.Item style={{ border: '1px solid black' }}>
            <AddNewInstanceSection />
          </List.Item>
        </List>
      </>
    );
  }
};

const getInstancesPaths = (store) =>
  store && store.startupScreen ? store.startupScreen.instancesPaths : [];

const updateChosenInstancePath = (instancePath) => ({
  type: RECEIVE_ENTITIES,
  payload: {
    chosenInstancePath: instancePath,
  },
});

export default connect(
  (state) => ({
    instancesPaths: getInstancesPaths(state),
  }),
  {
    updateChosenInstancePath: updateChosenInstancePath,
  },
)(InstancesMenuScreen);
