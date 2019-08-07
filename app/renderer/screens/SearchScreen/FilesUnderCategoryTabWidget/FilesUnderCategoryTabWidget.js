import React from 'react';
import { useMachine } from '@xstate/react';
import machine from './machine,';
import FilesUnderCategoryTabContainer from '../containers/FilesUnderCategoryTabContainer';
import store from '../../../redux/store';
import { RECEIVE_ENTITIES } from '../actionTypes';
import getSqlDriver from '../../../db/getSqlDriver';
import { selectFilesUnderCategoryByName } from '../sqlQueries';

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

const getSearchText = (store) => {
  return store && store.searchScreen ? store.searchScreen.searchText : '';
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
  services: {
    fetchFilesUnderCategory: (_, __) => fetchFilesUnderCategory(),
  },
  actions: {
    updateSearchText: (_, event) => updateSearchText(event.searchText),
  },
});

const FilesUnderCategoryTabWidget = () => {
  const [_, send] = useMachine(machineWithConfig);
  const onChangeSearchText = (searchText) => send('SEARCH_TEXT_CHANGED', { searchText });
  return <FilesUnderCategoryTabContainer onChangeSearchText={onChangeSearchText} />;
};

export default FilesUnderCategoryTabWidget;
