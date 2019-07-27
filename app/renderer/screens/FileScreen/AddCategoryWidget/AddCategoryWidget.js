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
import { Message, Header, Label } from 'semantic-ui-react';
import BroaderCategoriesModalContainer from './Modal/BroaderCategoriesModalContainer';

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

const getBroaderFileCategoriesFromDb = async (categoryId) => {
  const categoryAncestors = await queryCategoryAncestors(categoryId);
  const categoryAncestorIds = categoryAncestors.map(({ id }) => id);
  const fileCategories = getCategories(store.getState());
  const broaderFileCategories = fileCategories.filter((fileCategory) =>
    categoryAncestorIds.includes(fileCategory.id),
  );
  return Promise.resolve(broaderFileCategories);
};

const fetchBroaderCategoriesOfFile = async () => {
  const chosenSearchResultCategory = getChosenSearchResultCategory(store.getState());
  return getBroaderFileCategoriesFromDb(chosenSearchResultCategory.id); // TODO: Think of more elaborate way to handle an error here, it should not cause transition to `attemptingToCreateRelationshipLoading` but to some other state that shows that an error occurred.
};

const removeBroaderFileCategoriesIfExist = async (categoryId, fileId) => {
  const broaderFileCategories = await getBroaderFileCategoriesFromDb(categoryId);
  for (let i = 0; i < broaderFileCategories.length; i++) {
    const broaderFileCategory = broaderFileCategories[i];
    await queryDeleteFileCategory(broaderFileCategory.id, fileId);
  }
};

const getFile = (store) => (store && store.specificTagScreen ? store.specificTagScreen.file : '');

const getChosenSearchResultCategory = (store) =>
  store && store.specificTagScreen ? store.specificTagScreen.chosenSearchResultCategory : {};

const fetchNarrowerCategoriesOfFileInDb = async (category) => {
  const fileCategories = getCategories(store.getState());
  let narrowerCategoriesOfFile = [];
  for (let i = 0; i < fileCategories.length; i++) {
    const fileCategory = fileCategories[i];
    const fileCategoryAncestors = await queryCategoryAncestors(fileCategory.id);
    const fileCategoryAncestorIds = fileCategoryAncestors.map(({ id }) => id);
    if (fileCategoryAncestorIds.includes(category.id)) {
      narrowerCategoriesOfFile.push(fileCategory);
    }
  }
  return Promise.resolve(narrowerCategoriesOfFile);
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

const fetchNarrowerCategoriesOfFile = async () => {
  const chosenSearchResultCategory = getChosenSearchResultCategory(store.getState());

  return fetchNarrowerCategoriesOfFileInDb(chosenSearchResultCategory);
};

const updateErrorMessageFetchingNarrowerCategoriesFailed = (error) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      genericErrorAddCategoryWidget: error.message,
    },
  });
};

const updateCategories = (newCategories) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      categories: newCategories,
    },
  });
};

const getBroaderCategoriesFromState = (store) =>
  store && store.specificTagScreen ? store.specificTagScreen.broaderFileCategories : [];

const replaceBroaderCategoriesWithNarrowerCategoryInState = () => {
  const chosenSearchResultCategory = getChosenSearchResultCategory(store.getState());
  const broaderCategories = getBroaderCategoriesFromState(store.getState());
  const previousCategories = getCategories(store.getState());
  const broaderCategoriesIds = broaderCategories.map((broaderCategory) => broaderCategory.id);
  const filteredPreviousCategories = previousCategories.filter(
    (previousCategory) => broaderCategoriesIds.includes(previousCategory.id) === false,
  );

  const newCategories = [...filteredPreviousCategories, chosenSearchResultCategory];
  updateCategories(newCategories);
};

const addCategoryToCategoriesState = () => {
  const chosenSearchResultCategory = getChosenSearchResultCategory(store.getState());
  const previousCategories = getCategories(store.getState());
  const newCategories = [...previousCategories, chosenSearchResultCategory];
  updateCategories(newCategories);
};

const replaceBroaderCategoriesWithNarrowerCategoryInDb = async () => {
  const file = getFile(store.getState());
  const chosenSearchResultCategory = getChosenSearchResultCategory(store.getState());
  await removeBroaderFileCategoriesIfExist(chosenSearchResultCategory.id, file.id);
  return queryAddCategoryToFile(file.id, chosenSearchResultCategory);
};

const updateNarrowerCategoriesOfFile = (narrowerCategoriesOfFile) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      narrowerCategoriesOfFile,
    },
  });
};

const areNarrowerCategoriesOfFileEmpty = (narrowerCategoriesOfFile) => {
  return narrowerCategoriesOfFile.length === 0;
};

const areBroaderCategoriesOfFileEmpty = (broaderCategoriesOfFile) => {
  return broaderCategoriesOfFile.length === 0;
};

const attemptToAddCategoryToDb = () => {
  const file = getFile(store.getState());
  const chosenSearchResultCategory = getChosenSearchResultCategory(store.getState());
  return queryAddCategoryToFile(file.id, chosenSearchResultCategory);
};

const updateBroaderFileCategories = (broaderCategoriesOfFile) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      broaderFileCategories: broaderCategoriesOfFile,
    },
  });
};

const categoryIsntAlreadyAssigned = (category) => {
  const categories = getCategories(store.getState());
  const categoriesIds = categories.map((category) => category.id);
  return categoriesIds.includes(category.id) === false;
};

const machineWithConfig = machine.withConfig({
  services: {
    fetchSearchResultCategories: (_, event) => fetchSearchResultCategories(event.searchQuery),
    fetchBroaderCategoriesOfFile: (_, __) => fetchBroaderCategoriesOfFile(),
    replaceBroaderCategoriesWithNarrowerCategoryInDb: (_, __) =>
      replaceBroaderCategoriesWithNarrowerCategoryInDb(),
    fetchNarrowerCategoriesOfFile: (_, __) => fetchNarrowerCategoriesOfFile(),
    attemptToAddCategoryToDb: (_, __) => attemptToAddCategoryToDb(),
  },
  actions: {
    updateInputSearchQuery: (_, event) => updateInputSearchQuery(event.searchQuery),
    updateChosenSearchResultCategory: (_, event) =>
      updateChosenSearchResultCategory(event.category),
    updateSearchResultCategories: (_, event) => updateSearchResultCategories(event.data),
    resetInputSearchQuery: (_, __) => updateInputSearchQuery(''),
    updateErrorMessageFetchingNarrowerCategoriesFailed: (_, event) =>
      updateErrorMessageFetchingNarrowerCategoriesFailed(event.data),
    addCategoryToCategoriesState: (_, __) => addCategoryToCategoriesState(),
    updateNarrowerCategoriesOfFile: (_, event) => updateNarrowerCategoriesOfFile(event.data),
    replaceBroaderCategoriesWithNarrowerCategoryInState: (_, __) =>
      replaceBroaderCategoriesWithNarrowerCategoryInState(),
    updateBroaderFileCategories: (_, event) => updateBroaderFileCategories(event.data),
  },
  guards: {
    areNarrowerCategoriesOfFileEmpty: (_, event) => areNarrowerCategoriesOfFileEmpty(event.data),
    areBroaderCategoriesOfFileEmpty: (_, event) => areBroaderCategoriesOfFileEmpty(event.data),
    categoryIsntAlreadyAssigned: (_, event) => categoryIsntAlreadyAssigned(event.category),
  },
});

const AddCategoryWidget = ({ errorMessage, narrowerCategoriesOfFile }) => {
  const [current, send] = useMachine(machineWithConfig, {
    devTools: true,
  });

  return (
    <>
      {current.matches('idle.failure') ? (
        <Message error compact header="Error" content={errorMessage} />
      ) : null}
      {current.matches('idle.highlightExistingCategory') ? (
        <Message info compact header="Category already exists" />
      ) : null}
      {current.matches('idle.highlightNarrowerCategories') ? (
        <Message
          info
          compact
          header="Following existing categories are narrower"
          content={
            <Label.Group tag color="orange">
              {narrowerCategoriesOfFile.map((narrowerCategoryOfFile) => (
                <Label key={narrowerCategoryOfFile.id}>{narrowerCategoryOfFile.name}</Label>
              ))}
            </Label.Group>
          }
        />
      ) : null}
      <BroaderCategoriesModalContainer
        isOpen={current.matches('broadCategoriesModal')}
        onClose={() => send('CLOSE_BROAD_CATEGORIES_MODAL_REJECT')}
        onClickYes={() => send('CLICK_ACCEPT_BROAD_CATEGORIES_MODAL')}
      />

      <AddCategoryContainer
        onChooseSearchResultCategory={(category) =>
          send('CHOOSE_CATEGORY_TO_ASSIGN', {
            category: category,
          })
        }
        onChangeInputSearchQuery={(searchQuery) =>
          send('INPUT_SEARCH_QUERY_CHANGED', { searchQuery })
        }
      />
    </>
  );
};

const getGenericErrorAddCategoryWidget = (store) =>
  store && store.specificTagScreen ? store.specificTagScreen.genericErrorAddCategoryWidget : '';

const getNarrowerCategoriesOfFile = (store) =>
  store && store.specificTagScreen ? store.specificTagScreen.narrowerCategoriesOfFile : [];

export default connect((state) => ({
  errorMessage: getGenericErrorAddCategoryWidget(state),
  narrowerCategoriesOfFile: getNarrowerCategoriesOfFile(state),
}))(AddCategoryWidget);
