import React from 'react';
import PropTypes from 'prop-types';
import { useMachine } from '@xstate/react';
import { connect } from 'react-redux';

import { RECEIVE_ENTITIES } from './actionTypes';
import machine from './machine';
import {
  selectCategoriesOfFile,
  selectCategoryByName,
  insertCategoryOfFile,
  selectCategoryAncestors,
  deleteCategoryOfFile,
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
import querySelectCategoriesWithMatchingName from '../../query-functions/querySelectCategoriesWithMatchingName';
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

const queryCategorId = (categoryName) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectCategoryByName,
      {
        $category_name: categoryName,
      },
      (err, rows) => {
        if (err) {
          console.log('err:', err);
          reject();
        } else {
          const categoryRow = rows[0];
          const { id: categoryId } = categoryRow;
          resolve(categoryId);
        }
      },
    );
  });
};

const categoryAlreadyExistsErrorMessage = `SQLITE_CONSTRAINT: UNIQUE constraint failed: categories_files.category_id, categories_files.file_id`;

const queryAddCategoryToFile = (fileId, categoryId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      insertCategoryOfFile,
      {
        $category_id: categoryId,
        $file_id: fileId,
      },
      function(err) {
        if (err) {
          if (err.message === categoryAlreadyExistsErrorMessage) {
            console.log('Error: category already exists on file');
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

const getCategories = (store) =>
  store && store.specificTagScreen ? store.specificTagScreen.categories : [];

const getParentCategoryName = (store) =>
  store && store.specificTagScreen ? store.specificTagScreen.inputParentTag : '';

const queryCategoryAncestors = (categoryId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectCategoryAncestors,
      {
        $category_id: categoryId,
      },
      (err, rows) => {
        if (err) {
          console.log('unknown error:', err);
          reject();
        } else {
          resolve(rows);
        }
      },
    );
  });
};

const checkIfCategoryIsInNacestors = async (categoryId) => {
  const fileCategories = getCategories(store.getState());
  for (let i = 0; i < fileCategories.length; i++) {
    const fileCategory = fileCategories[i];
    const fileCategoryAncestors = await queryCategoryAncestors(fileCategory.id);
    const fileCategoryAncestorIds = fileCategoryAncestors.map(({ id }) => id);
    if (fileCategoryAncestorIds.includes(categoryId)) {
      return true;
    }
  }
  return false;
};

const queryDeleteFileCategory = (categoryId, fileId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      deleteCategoryOfFile,
      {
        $category_id: categoryId,
        $file_id: fileId,
      },
      function(err) {
        if (err) {
          console.log('unknown error:', err);
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

const getBroaderFileCategories = async (categoryId) => {
  const categoryAncestors = await queryCategoryAncestors(categoryId);
  const categoryAncestorIds = categoryAncestors.map(({ id }) => id);
  const fileCategories = getCategories(store.getState());
  const broaderFileCategories = fileCategories.filter((fileCategory) =>
    categoryAncestorIds.includes(fileCategory.id),
  );
  return Promise.resolve(broaderFileCategories);
};

const removeBroaderFileCategoriesIfExist = async (categoryId, fileId) => {
  const broaderFileCategories = await getBroaderFileCategories(categoryId);
  for (let i = 0; i < broaderFileCategories.length; i++) {
    const broaderFileCategory = broaderFileCategories[i];
    await queryDeleteFileCategory(broaderFileCategory.id, fileId);
  }
};

const getChosenSearchResultCategoryId = (store) =>
  store && store.specificTagScreen
    ? store.specificTagScreen.chosenSearchResultCategoryId
    : undefined;

const attemptCreatingRelationship = async () => {
  const file = getFile(store.getState());
  const categoryId = getChosenSearchResultCategoryId(store.getState());

  const isCategoryInAncestors = await checkIfCategoryIsInNacestors(categoryId);
  if (isCategoryInAncestors) {
    throw new Error();
  } else {
    await removeBroaderFileCategoriesIfExist(categoryId, file.id);
    return await queryAddCategoryToFile(file.id, categoryId);
  }
};

const checkExistenceBroadCategories = async (categoryId) => {
  const broaderFileCategories = await getBroaderFileCategories(categoryId); // TODO: Think of more elaborate way to handle an error here, it should not cause transition to `attemptingToCreateRelationshipLoading` but to some other state that shows that an error occurred.
  if (broaderFileCategories.length > 0) {
    store.dispatch({
      type: RECEIVE_ENTITIES,
      payload: {
        broaderFileCategories: broaderFileCategories,
      },
    });
    return Promise.resolve();
  } else {
    return Promise.reject();
  }
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

const fetchSearchResultCategories = (searchQuery) => {
  return querySelectCategoriesWithMatchingName(searchQuery);
};

const updateInputSearchQuery = (searchQuery) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      inputSearchQuery: searchQuery,
    },
  });
};

const updateSearchResultCategories = (searchResultCategories) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      searchResultCategories: searchResultCategories,
    },
  });
};

const updateChosenSearchResultCategoryId = (categoryId) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      chosenSearchResultCategoryId: categoryId,
    },
  });
};

const machineWithConfig = machine.withConfig({
  services: {
    fetchFileData: (context, _) => fetchFileData(context.fileId),
    fetchSearchResultCategories: (_, event) => fetchSearchResultCategories(event.searchQuery),
    attemptCreatingRelationship: (_, __) => attemptCreatingRelationship(),
    checkExistenceBroadCategories: (_, event) => checkExistenceBroadCategories(event.categoryId),
    removeCategoryOfFile: (_, event) => removeCategoryOfFile(event.category),
    attemptToRenameFile: (_, event) => attemptToRenameFile(event.file, event.newFileName),
    deleteFile: (_, event) => deleteFile(event.file),
  },
  actions: {
    updateInputSearchQuery: (_, event) => updateInputSearchQuery(event.searchQuery),
    updateSearchResultCategories: (_, event) => updateSearchResultCategories(event.data),
    updateChosenSearchResultCategoryId: (_, event) =>
      updateChosenSearchResultCategoryId(event.categoryId),
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
        <FileMenuContainer
          onChooseSearchResultCategory={checkExistenceBroadCategories}
          onChangeInputSearchQuery={(searchQuery) =>
            send('INPUT_SEARCH_QUERY_CHANGED', { searchQuery })
          }
          onClickOpenFile={openFile}
          onClickCategory={openCategoryActionsModal}
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
