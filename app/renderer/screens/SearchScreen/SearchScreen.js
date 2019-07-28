import React from 'react';
import { useMachine } from '@xstate/react';
import { Button, Divider } from 'semantic-ui-react';

import { RECEIVE_ENTITIES } from './actionTypes';
import machine from './machine';
import { connect } from 'react-redux';
import AllFilesTabWidget from './AllFilesTabWidget/AllFilesTabWidget';
import FilesUnderCategoryTabWidget from './FilesUnderCategoryTabWidget/FilesUnderCategoryTabWidget';

const SearchScreen = ({ resetFormStates }) => {
  const [current, send] = useMachine(machine);

  React.useEffect(() => {
    return () => resetFormStates();
  }, []);

  if (current.matches('allFiles')) {
    return (
      <>
        <Button size="massive" disabled>
          All Files{' '}
        </Button>
        <Button size="massive" onClick={() => send('CLICK_FILES_UNDER_CATEGORY_TAB')}>
          Files under Category{' '}
        </Button>
        <Divider horizontal />
        <AllFilesTabWidget />
      </>
    );
  } else if (current.matches('filesUnderCategory')) {
    return (
      <>
        <Button size="massive" onClick={() => send('CLICK_ALL_FILES_TAB')}>
          All Files{' '}
        </Button>
        <Button size="massive" disabled>
          Files under Category{' '}
        </Button>
        <Divider horizontal />
        <FilesUnderCategoryTabWidget />
      </>
    );
  } else {
    return <h2>Unkown state</h2>;
  }
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
