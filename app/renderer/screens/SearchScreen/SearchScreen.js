import React from 'react';
import { Tab } from 'semantic-ui-react';

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

  return <Tab panes={panes} menu={{ secondary: true, attached: true }} renderActiveOnly />;
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
