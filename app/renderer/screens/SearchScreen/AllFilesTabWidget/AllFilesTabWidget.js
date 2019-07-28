import React from 'react';
import { useMachine } from '@xstate/react';
import machine from './machine';
import store from '../../../redux/store';
import { RECEIVE_ENTITIES } from '../actionTypes';
import getSqlDriver from '../../../sqlDriver';
import { selectFilesByName } from '../sqlQueries';
import AllFilesTab from './AllFilesTab';

const getSearchText = (store) => {
  return store && store.searchScreen ? store.searchScreen.searchText : '';
};

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
    fetchAllFiles: (_, __) => fetchAllFiles(),
  },
  actions: {
    updateSearchText: (_, event) => updateSearchText(event.searchText),
  },
});

const AllFilesTabWidget = () => {
  const [_, send] = useMachine(machineWithConfig);
  const onChangeSearchText = (searchText) => send('SEARCH_TEXT_CHANGED', { searchText });
  return <AllFilesTab onChangeSearchText={onChangeSearchText} />;
};

export default AllFilesTabWidget;
