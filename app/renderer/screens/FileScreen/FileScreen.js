import React from 'react';
import PropTypes from 'prop-types';
import { useMachine } from '@xstate/react';
import { connect } from 'react-redux';

import { RECEIVE_ENTITIES } from './actionTypes';
import machine from './machine';
import {
  selectCategoriesOfFile,
  updateFileName,
  selectFileName,
  deleteFileFromFiles,
  deleteFileFromCategoriesFiles,
} from '../../sql_queries';
import getSqlDriver from '../../sqlDriver';
import store from '../../redux/store';
import FileMenuContainer from './containers/FileMenuContainer';
import openFileByName from '../../utils/openFileByName';
import BroaderCategoriesModalContainer from './containers/BroaderCategoriesModalContainer';
import CategoryActionsModalContainer from './containers/CategoryActionsModalContainer';
import formatFilePath from '../../utils/formatFilePath';
import AddCategoryWidget from './AddCategoryWidget/AddCategoryWidget';
import queryDeleteFileCategory from '../../query-functions/queryDeleteFileCategory';
import CategoriesContainer from './containers/CategoriesContainer';
import FileNameWidgetContainer from './FileNameWidget/FileNameWidgetContainer';
const fs = require('fs');

const renameFileToFs = (oldFileName, newFileName) =>
  new Promise((resolve, reject) => {
    const oldFilePath = formatFilePath(oldFileName);
    const newFilePath = formatFilePath(newFileName);
    fs.rename(oldFilePath, newFilePath, (err) => {
      if (err) {
        console.log('unknown error occurred:', err);
        reject();
      } else {
        console.log('The file has been renamed!');
        resolve();
      }
    });
  });

const deleteFileFromFs = (fileName) =>
  new Promise((resolve, reject) => {
    const filePath = formatFilePath(fileName);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log('unknown error occurred:', err);
        reject();
      } else {
        console.log('The file has been deleted!');
        resolve();
      }
    });
  });

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

const getFile = (store) => (store && store.specificTagScreen ? store.specificTagScreen.file : '');

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
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      file: {
        id: fileId,
        name: fileName,
      },
      categories: categories,
    },
  });
};

const removeCategoryOfFile = async (category) => {
  const file = getFile(store.getState());
  return await queryDeleteFileCategory(category.id, file.id);
};

const fileNameAlreadyExistsErrorMessage = `SQLITE_CONSTRAINT: UNIQUE constraint failed: files.name`;

const queryRenameFileInDb = (fileId, newFileName) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      updateFileName,
      {
        $file_name: newFileName,
        $file_id: fileId,
      },
      function(err) {
        if (err) {
          if (err.message === fileNameAlreadyExistsErrorMessage) {
            console.log('Error: file name already exists in db');
          } else {
            console.log('unknown error:', err);
          }
          reject();
        } else {
          const { changes: affectedRowsCount } = this;
          if (affectedRowsCount !== 1) {
            console.log('No affected rows error');
            reject();
          } else {
            resolve();
          }
        }
      },
    );
  });
};

const attemptToRenameFile = async (file, newFileName) => {
  await queryRenameFileInDb(file.id, newFileName);
  try {
    return await renameFileToFs(file.name, newFileName);
  } catch (error) {
    await queryRenameFileInDb(file.id, file.name); // Revert rename
    throw error;
  }
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

const machineWithConfig = machine.withConfig({
  services: {
    fetchFileData: (context, _) => fetchFileData(context.fileId),
    removeCategoryOfFile: (_, event) => removeCategoryOfFile(event.category),
    attemptToRenameFile: (_, event) => attemptToRenameFile(event.file, event.newFileName),
    deleteFile: (_, event) => deleteFile(event.file),
  },
});

const openFile = (file) => {
  openFileByName(file.name);
};

const FileScreen = ({ updateCategoryForActionsModal, fileId }) => {
  const [current, send] = useMachine(
    machineWithConfig.withContext({
      fileId: fileId,
    }),
  );

  const checkExistenceBroadCategories = (categoryId) =>
    send('CHECK_BROAD_CATEGORIES', {
      categoryId: categoryId,
    });

  const openCategoryActionsModal = (category) => {
    updateCategoryForActionsModal(category);
    send('OPEN_FILE_CATEGORY_ACTIONS_MODAL');
  };

  if (current.matches('idle')) {
    return (
      <>
        <BroaderCategoriesModalContainer
          isOpen={current.matches('idle.broadCategoriesModal')}
          onClose={() => send('CLOSE_BROAD_CATEGORIES_MODAL_REJECT')}
          onClickYes={() => send('CLICK_ACCEPT_BROAD_CATEGORIES_MODAL')}
        />
        <CategoryActionsModalContainer
          isOpen={current.matches('idle.fileCategoryActionsModal')}
          onClose={() => send('CLOSE_FILE_CATEGORY_ACTIONS_MODAL')}
          onClickRemoveCategory={(category) =>
            send('CLICK_REMOVE_CATEGORY_ACTIONS_MODAL', { category: category })
          }
        />
        <FileNameWidgetContainer />
        <CategoriesContainer onClickCategory={openCategoryActionsModal} />
        <AddCategoryWidget fetchFileData={() => send('REFETCH_FILE_DATA')} />
        <FileMenuContainer
          onChooseSearchResultCategory={checkExistenceBroadCategories}
          onChangeInputSearchQuery={(searchQuery) =>
            send('INPUT_SEARCH_QUERY_CHANGED', { searchQuery })
          }
          onClickOpenFile={openFile}
          onClickDeleteFile={(file) =>
            send('CLICK_DELETE_FILE', {
              file: file,
            })
          }
          onClickRenameFile={(file, newFileName) =>
            send('CLICK_RENAME_FILE', {
              file: file,
              newFileName: newFileName,
            })
          }
        />
        {current.matches('idle.success') ? <h2 style={{ color: 'green' }}>Succeeded</h2> : null}
        {current.matches('idle.failure') ? <h2 style={{ color: 'red' }}>Failed</h2> : null}
      </>
    );
  } else if (current.matches('loading')) {
    return <h2>Loading...</h2>;
  } else if (current.matches('deletedFile')) {
    return <h2 style={{ color: 'green' }}>File has been deleted successfully</h2>;
  } else {
    return <h3>Unknown state</h3>;
  }
};

const updateCategoryForActionsModal = (category) => ({
  type: RECEIVE_ENTITIES,
  payload: {
    chosenCategoryForActionsModal: category,
  },
});

const FileScreenContainer = connect(
  null,
  {
    updateCategoryForActionsModal: updateCategoryForActionsModal,
  },
)(FileScreen);

FileScreenContainer.propTypes = {
  fileId: PropTypes.number.isRequired,
};

export default FileScreenContainer;
