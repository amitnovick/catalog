import React from 'react';
import { useMachine } from '@xstate/react';
import { connect } from 'react-redux';

import machine from './machine';
import AddCategoryContainer from './AddCategoryContainer';
import store from '../../../redux/store';
import { RECEIVE_ENTITIES } from '../actionTypes';
import querySelectCategoriesWithMatchingName from '../../../query-functions/querySelectCategoriesWithMatchingName';
import getSqlDriver from '../../../sqlDriver';
import { selectCategoryAncestors, insertCategoryOfFile } from '../../../sql_queries';
import queryDeleteFileCategory from '../../../query-functions/queryDeleteFileCategory';
import { Message } from 'semantic-ui-react';

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

const updateChosenSearchResultCategory = (category) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      chosenSearchResultCategory: category,
    },
  });
};

const queryCategoryAncestors = (categoryId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectCategoryAncestors,
      {
        $category_id: categoryId,
      },
      (err, rows) => {
        if (err) {
          reject(new Error(`Unknown error: ${err.message}`));
        } else {
          resolve(rows);
        }
      },
    );
  });
};

const getCategories = (store) =>
  store && store.specificTagScreen ? store.specificTagScreen.categories : [];

const getBroaderFileCategories = async (categoryId) => {
  const categoryAncestors = await queryCategoryAncestors(categoryId);
  const categoryAncestorIds = categoryAncestors.map(({ id }) => id);
  const fileCategories = getCategories(store.getState());
  const broaderFileCategories = fileCategories.filter((fileCategory) =>
    categoryAncestorIds.includes(fileCategory.id),
  );
  return Promise.resolve(broaderFileCategories);
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

const removeBroaderFileCategoriesIfExist = async (categoryId, fileId) => {
  const broaderFileCategories = await getBroaderFileCategories(categoryId);
  for (let i = 0; i < broaderFileCategories.length; i++) {
    const broaderFileCategory = broaderFileCategories[i];
    await queryDeleteFileCategory(broaderFileCategory.id, fileId);
  }
};

const getFile = (store) => (store && store.specificTagScreen ? store.specificTagScreen.file : '');

const getChosenSearchResultCategory = (store) =>
  store && store.specificTagScreen ? store.specificTagScreen.chosenSearchResultCategory : {};

const checkIfCategoryIsInNacestors = async (category) => {
  const fileCategories = getCategories(store.getState());
  for (let i = 0; i < fileCategories.length; i++) {
    const fileCategory = fileCategories[i];
    const fileCategoryAncestors = await queryCategoryAncestors(fileCategory.id);
    const fileCategoryAncestorIds = fileCategoryAncestors.map(({ id }) => id);
    if (fileCategoryAncestorIds.includes(category.id)) {
      return true;
    }
  }
  return false;
};

const categoryAlreadyExistsErrorMessage = `SQLITE_CONSTRAINT: UNIQUE constraint failed: categories_files.category_id, categories_files.file_id`;

const queryAddCategoryToFile = (fileId, category) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      insertCategoryOfFile,
      {
        $category_id: category.id,
        $file_id: fileId,
      },
      function(err) {
        if (err) {
          if (err.message === categoryAlreadyExistsErrorMessage) {
            const errorMessage = `Category ${category.name} already exists on file`;
            reject(new Error(errorMessage));
          } else {
            const errorMessage = `Unknown error:, ${err.message}`;
            reject(new Error(errorMessage));
          }
        } else {
          const { changes: affectedRowsCount } = this;
          if (affectedRowsCount !== 1) {
            reject(new Error('No affected rows error'));
          } else {
            resolve();
          }
        }
      },
    );
  });
};

const attemptCreatingRelationship = async () => {
  const file = getFile(store.getState());
  const chosenSearchResultCategory = getChosenSearchResultCategory(store.getState());

  const isCategoryInAncestors = await checkIfCategoryIsInNacestors(chosenSearchResultCategory);
  if (isCategoryInAncestors) {
    const errorMessage = `Category ${chosenSearchResultCategory.name} is already an ancestor of an existing category!`;
    return Promise.reject(new Error(errorMessage));
  } else {
    await removeBroaderFileCategoriesIfExist(chosenSearchResultCategory.id, file.id);
    return await queryAddCategoryToFile(file.id, chosenSearchResultCategory);
  }
};

const updateErrorMessage = (error) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      errorMessageCreatingRelationship: error.message,
    },
  });
};

const addChosenCategoryToState = () => {
  const chosenSearchResultCategory = getChosenSearchResultCategory(store.getState());
  const previousCategories = getCategories(store.getState());
  const newCategories = [...previousCategories, chosenSearchResultCategory];
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      categories: newCategories,
    },
  });
};

const machineWithConfig = machine.withConfig({
  services: {
    fetchSearchResultCategories: (_, event) => fetchSearchResultCategories(event.searchQuery),
    checkExistenceBroadCategories: (_, event) => checkExistenceBroadCategories(event.categoryId),
    attemptCreatingRelationship: (_, __) => attemptCreatingRelationship(),
  },
  actions: {
    updateInputSearchQuery: (_, event) => updateInputSearchQuery(event.searchQuery),
    updateChosenSearchResultCategory: (_, event) =>
      updateChosenSearchResultCategory(event.category),
    updateSearchResultCategories: (_, event) => updateSearchResultCategories(event.data),
    resetInputSearchQuery: (_, __) => updateInputSearchQuery(''),
    updateErrorMessage: (_, event) => updateErrorMessage(event.data),
    addChosenCategoryToState: (_, __) => addChosenCategoryToState(),
  },
});

const AddCategoryWidget = ({ errorMessage }) => {
  const [current, send] = useMachine(machineWithConfig);

  const checkExistenceBroadCategories = (category) =>
    send('CHECK_BROAD_CATEGORIES', {
      category: category,
    });

  return (
    <>
      <AddCategoryContainer
        onChooseSearchResultCategory={checkExistenceBroadCategories}
        onChangeInputSearchQuery={(searchQuery) =>
          send('INPUT_SEARCH_QUERY_CHANGED', { searchQuery })
        }
      />
      {current.matches('idle.failure') ? (
        <Message error compact header="Error" content={errorMessage} />
      ) : null}
    </>
  );
};

const getErrorMessageCreatingRelationship = (store) =>
  store && store.specificTagScreen ? store.specificTagScreen.errorMessageCreatingRelationship : '';

export default connect((state) => ({
  errorMessage: getErrorMessageCreatingRelationship(state),
}))(AddCategoryWidget);
