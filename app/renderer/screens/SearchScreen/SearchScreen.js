import React from 'react';
import { useMachine } from '@xstate/react';
import { Button, Divider } from 'semantic-ui-react';

import store from '../../redux/store';
import { RECEIVE_ENTITIES } from './actionTypes';
import machine from './machine';
import AllFilesTab from './components/AllFilesTab';
import FilesUnderCategoryTabContainer from './containers/FilesUnderCategoryTabContainer';
import getSqlDriver from '../../sqlDriver';
import { selectFilesByName, selectFilesUnderCategoryByName } from './sqlQueries';
import { connect } from 'react-redux';

const queryFilesByName = async (fileName) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectFilesByName,
      {
        $file_name: `%${fileName}%`,
      },
      (err, rows) => {
        if (err) {
          console.log('err:', err);
          reject();
        } else {
          resolve(rows);
        }
      },
    );
  });
};

const getSearchText = (store) => {
  return store && store.searchScreen ? store.searchScreen.searchText : '';
};

const fetchAllFiles = async () => {
  const fileName = getSearchText(store.getState());
  const files = await queryFilesByName(fileName);
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      files: files,
    },
  });
};

const getCategoryName = (store) => {
  return store && store.searchScreen ? store.searchScreen.categoryName : '';
};

const queryFilesUnderCategoryByName = (fileName, categoryName) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectFilesUnderCategoryByName,
      {
        $file_name: `%${fileName}%`,
        $category_name: categoryName,
      },
      (err, rows) => {
        if (err) {
          console.log('err:', err);
          reject();
        } else {
          resolve(rows);
        }
      },
    );
  });
};

const fetchFilesUnderCategory = async () => {
  const fileName = getSearchText(store.getState());
  const categoryName = getCategoryName(store.getState());
  const files = await queryFilesUnderCategoryByName(fileName, categoryName);
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      files: files,
    },
  });
};

const updateSearchText = (searchText) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      searchText: searchText,
    },
  });
};

const machineWithConfig = machine.withConfig({
  // actions: {
  //   queryTagsNotFromRoot: () =>
  //     queryAndUpdateState({ shouldStartFromRootNode: false }),
  // },
  services: {
    fetchAllFiles: (_, __) => fetchAllFiles(),
    fetchFilesUnderCategory: (_, __) => fetchFilesUnderCategory(),
  },
  actions: {
    updateSearchText: (_, event) => updateSearchText(event.searchText),
  },
});

const SearchScreen = ({ resetFormStates }) => {
  const [current, send] = useMachine(machineWithConfig);

  React.useEffect(() => {
    return () => resetFormStates();
  }, []);

  const onChangeSearchText = (searchText) => send('SEARCH_TEXT_CHANGED', { searchText });
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
        <AllFilesTab onChangeSearchText={onChangeSearchText} />
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
        <FilesUnderCategoryTabContainer onChangeSearchText={onChangeSearchText} />
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
