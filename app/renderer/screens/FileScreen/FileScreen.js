import React from 'react';
import PropTypes from 'prop-types';
import { useMachine } from '@xstate/react';

import { RECEIVE_ENTITIES } from './actionTypes';
import machine from './machine';
import {
  selectCategoriesOfFile,
  selectFileName,
  deleteFileFromFiles,
  deleteFileFromCategoriesFiles,
} from '../../sql_queries';
import getSqlDriver from '../../sqlDriver';
import store from '../../redux/store';
import FileMenuContainer from './containers/FileMenuContainer';
import openFileByName from '../../utils/openFileByName';
import AddCategoryWidget from './AddCategoryWidget/AddCategoryWidget';
import FileNameWidget from './FileNameWidget/FileNameWidget';
import CategoriesWidget from './CategoriesWidget/CategoriesWidget';
import { Grid, Divider, Segment, Icon } from 'semantic-ui-react';
import deleteFileFromFs from '../../utils/deleteFile';

const queryCategoriesOfFile = (fileId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectCategoriesOfFile,
      {
        $file_id: fileId,
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

const queryFileName = (fileId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectFileName,
      {
        $file_id: fileId,
      },
      (err, rows) => {
        if (err) {
          console.log('err:', err);
          reject();
        } else {
          const fileRow = rows[0];
          const { name: fileName } = fileRow;
          resolve(fileName);
        }
      },
    );
  });
};

const fetchFileData = async (fileId) => {
  const fileName = await queryFileName(fileId);
  const categories = await queryCategoriesOfFile(fileId);
  const resolvedValue = {
    categories,
    file: {
      id: fileId,
      name: fileName,
    },
  };
  return Promise.resolve(resolvedValue);
};

const queryRemoveFileFromFilesTable = (fileId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      deleteFileFromFiles,
      {
        $file_id: fileId,
      },
      function(err) {
        if (err) {
          console.log('unknown error:', err);
          reject();
        } else {
          const { changes: affectedRowsCount } = this;
          if (affectedRowsCount !== 1) {
            console.log('queryRemoveFileFromFilesTable: No affected rows error');
            reject();
          } else {
            resolve();
          }
        }
      },
    );
  });
};

const queryRemoveFileFromCategoriesFilesTable = (fileId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      deleteFileFromCategoriesFiles,
      {
        $file_id: fileId,
      },
      function(err) {
        if (err) {
          console.log('unknown error:', err);
          reject();
        } else {
          resolve();
        }
      },
    );
  });
};

const deleteFile = async (file) => {
  await queryRemoveFileFromFilesTable(file.id);
  await queryRemoveFileFromCategoriesFilesTable(file.id);
  try {
    await deleteFileFromFs(file.name);
  } catch (error) {
    console.log('Error: failed to delete file from filesystem');
  }
};

const updateCategories = (categories) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      categories: categories,
    },
  });
};

const updateFile = (file) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      file: file,
    },
  });
};

const updateNewFileName = (file) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      newFileName: file.name,
    },
  });
};

const machineWithConfig = machine.withConfig({
  services: {
    fetchFileData: (context, _) => fetchFileData(context.fileId),
    deleteFile: (_, event) => deleteFile(event.file),
  },
  actions: {
    updateCategories: (_, event) => updateCategories(event.data.categories),
    updateFile: (_, event) => updateFile(event.data.file),
    updateNewFileName: (_, event) => updateNewFileName(event.data.file),
  },
});

const openFile = (file) => {
  openFileByName(file.name);
};

const FileScreen = ({ fileId }) => {
  const [current, send] = useMachine(
    machineWithConfig.withContext({
      fileId: fileId,
    }),
  );
  if (current.matches('idle') || current.matches('loading')) {
    return (
      <Grid>
        <Grid.Column width="3" />
        <Grid.Column width="10">
          <Segment style={{ textAlign: 'center' }}>
            <Icon name="file" color="yellow" size="huge" />
            <FileNameWidget refetchFileData={() => send('REFETCH_FILE_DATA')} />
            <Divider horizontal />
            <div style={{ border: '1px solid black', borderRadius: 6, padding: 5 }}>
              <CategoriesWidget />
              <AddCategoryWidget refetchFileData={() => send('REFETCH_FILE_DATA')} />
            </div>
            <FileMenuContainer
              onClickOpenFile={openFile}
              onClickDeleteFile={(file) =>
                send('CLICK_DELETE_FILE', {
                  file: file,
                })
              }
            />
            {current.matches('idle.success') ? <h2 style={{ color: 'green' }}>Succeeded</h2> : null}
            {current.matches('idle.failure') ? <h2 style={{ color: 'red' }}>Failed</h2> : null}
          </Segment>
        </Grid.Column>
        <Grid.Column width="3" />
      </Grid>
    );
  } else if (current.matches('deletedFile')) {
    return <h2 style={{ color: 'green' }}>File has been deleted successfully</h2>;
  } else {
    return <h3>Unknown state</h3>;
  }
};

FileScreen.propTypes = {
  fileId: PropTypes.number.isRequired,
};

export default FileScreen;
