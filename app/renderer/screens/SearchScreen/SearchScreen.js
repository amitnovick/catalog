import React from 'react';
import { Tab, Grid, Icon, Menu, Label } from 'semantic-ui-react';

import { RECEIVE_ENTITIES } from './actionTypes';
import { connect } from 'react-redux';
import AllFilesTabWidget from './AllFilesTabWidget/AllFilesTabWidget';
import FilesUnderCategoryTabWidget from './FilesUnderCategoryTabWidget/FilesUnderCategoryTabWidget';

const SearchScreen = ({ resetFormStates }) => {
  React.useEffect(() => {
    return () => resetFormStates();
  }, []);

  const panes = [
    {
      menuItem: 'All Files',
      render: () => (
        <Tab.Pane>
          <AllFilesTabWidget />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Files Under Category',
      render: () => (
        <Tab.Pane>
          <FilesUnderCategoryTabWidget />
        </Tab.Pane>
      ),
    },
  ];

  return (
    <Grid>
      <Grid.Column width="3" />
      <Grid.Column width="10">
        <Tab panes={panes} menu={{ secondary: true, attached: true }} renderActiveOnly />
      </Grid.Column>
      <Grid.Column width="3" />
    </Grid>
  );
};

const resetFormStates = () => ({
  type: RECEIVE_ENTITIES,
  payload: {
    files: [],
    searchText: '',
    categoryName: '',
  },
});

export default connect(
  null,
  {
    resetFormStates: resetFormStates,
  },
)(SearchScreen);
