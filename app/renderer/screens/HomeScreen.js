import React from 'react';
import { connect } from 'react-redux';
import { Header, Label } from 'semantic-ui-react';

const HomeScreen = ({ chosenInstancePath }) => {
  return (
    <>
      <Header as="h1">Welcome Home!</Header>
      <Header as="h2">Chosen instance:</Header>
      <Label size="massive">{chosenInstancePath}</Label>
    </>
  );
};

const getChosenInstancePath = (store) =>
  store && store.startupScreen ? store.startupScreen.chosenInstancePath : '';

export default connect((state) => ({
  chosenInstancePath: getChosenInstancePath(state),
}))(HomeScreen);
