import React from 'react';
import { connect } from 'react-redux';
import { Header, Label, Grid, Segment } from 'semantic-ui-react';

const HomeScreen = ({ chosenInstancePath }) => {
  return (
    <Grid>
      <Grid.Column width="3" />
      <Grid.Column width="10">
        <Segment style={{ textAlign: 'center' }}>
          <Header as="h1">Welcome Home!</Header>
          <Header as="h2">Chosen instance:</Header>
          <Label size="massive">{chosenInstancePath}</Label>
        </Segment>
      </Grid.Column>
      <Grid.Column width="3" />
    </Grid>
  );
};

const getChosenInstancePath = (store) =>
  store && store.startupScreen ? store.startupScreen.chosenInstancePath : '';

export default connect((state) => ({
  chosenInstancePath: getChosenInstancePath(state),
}))(HomeScreen);
