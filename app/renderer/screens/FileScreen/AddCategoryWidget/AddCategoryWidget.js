import React from 'react';
import { useMachine } from '@xstate/react';
import { connect } from 'react-redux';

import machine from './machine';
import AddCategoryContainer from './AddCategoryContainer';
import store from '../../../redux/store';
import { RECEIVE_ENTITIES } from '../actionTypes';
import querySelectCategoriesWithMatchingName from '../../../query-functions/querySelectCategoriesWithMatchingName';
import queryDeleteFileCategory from '../../../query-functions/queryDeleteFileCategory';
import { Message, Label, Button } from 'semantic-ui-react';
import BroaderCategoriesModalContainer from './Modal/BroaderCategoriesModalContainer';
import addNewCategory from '../../../query-functions/addNewCategory';
import queryGetCategoryByName from '../../../query-functions/queryGetCategoryByName';
import { css } from 'emotion';
import queryCategoryAncestors from '../../../query-functions/queryCategoryAncestors';
import queryAddCategoryToFile from '../../../query-functions/queryAddCategoryToFIle';

const spacedChildrenClass = css`
  & > * {
    margin: 0px 10px;
  }
`;

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




const fetchNarrowerCategoriesOfFile = async () => {
  const chosenSearchResultCategory = getChosenSearchResultCategory(store.getState());

  return fetchNarrowerCategoriesOfFileInDb(chosenSearchResultCategory);
};

const updateErrorMessage = (error) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      genericErrorAddCategoryWidget: error.message,
    },
  });
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

const attemptToAddChosenSearchResultCategory = () => {
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

const getInputSearchQuery = (store) =>
  store && store.specificTagScreen ? store.specificTagScreen.inputSearchQuery : '';

const isInputCategoryNameWhitespace = () => {
  const inputSearchQuery = getInputSearchQuery(store.getState());
  return inputSearchQuery.trim() !== '';
};

const createNewCategory = async () => {
  const newCategoryName = getInputSearchQuery(store.getState());
  await addNewCategory(newCategoryName);
  const newCategoryId = await queryGetCategoryByName(newCategoryName);
  const newCategory = {
    name: newCategoryName,
    id: newCategoryId,
  };
  return Promise.resolve(newCategory);
};

const fetchExistingCategoryAndAssign = async () => {
  const categoryName = getInputSearchQuery(store.getState());

  const categoryId = await queryGetCategoryByName(categoryName);
  const newCategory = {
    name: categoryName,
    id: categoryId,
  };
  return Promise.resolve(newCategory);
};

const machineWithConfig = machine.withConfig({
  services: {
    fetchSearchResultCategories: (_, event) => fetchSearchResultCategories(event.searchQuery),
    fetchBroaderCategoriesOfFile: (_, __) => fetchBroaderCategoriesOfFile(),
    replaceBroaderCategoriesWithNarrowerCategoryInDb: (_, __) =>
      replaceBroaderCategoriesWithNarrowerCategoryInDb(),
    fetchNarrowerCategoriesOfFile: (_, __) => fetchNarrowerCategoriesOfFile(),
    attemptToAddChosenSearchResultCategory: (_, __) => attemptToAddChosenSearchResultCategory(),
    createNewCategory: (_, __) => createNewCategory(),
    fetchExistingCategoryAndAssign: (_, __) => fetchExistingCategoryAndAssign(),
  },
  actions: {
    updateInputSearchQuery: (_, event) => updateInputSearchQuery(event.searchQuery),
    updateChosenSearchResultCategory: (_, event) =>
      updateChosenSearchResultCategory(event.category),
    updateSyntheticallyChosenSearchResultCategory: (_, event) =>
      updateChosenSearchResultCategory(event.data),
    updateSearchResultCategories: (_, event) => updateSearchResultCategories(event.data),
    resetInputSearchQuery: (_, __) => updateInputSearchQuery(''),
    updateErrorMessage: (_, event) => updateErrorMessage(event.data),
    updateNarrowerCategoriesOfFile: (_, event) => updateNarrowerCategoriesOfFile(event.data),
    updateBroaderFileCategories: (_, event) => updateBroaderFileCategories(event.data),
  },
  guards: {
    areNarrowerCategoriesOfFileEmpty: (_, event) => areNarrowerCategoriesOfFileEmpty(event.data),
    areBroaderCategoriesOfFileEmpty: (_, event) => areBroaderCategoriesOfFileEmpty(event.data),
    categoryIsntAlreadyAssigned: (_, event) => categoryIsntAlreadyAssigned(event.category),
    isCategoryNameWhitespace: (_, __) => isInputCategoryNameWhitespace(),
  },
});

const AddCategoryWidget = ({ errorMessage, narrowerCategoriesOfFile, refetchFileData }) => {
  const [current, send] = useMachine(machineWithConfig, {
    actions: {
      refetchFileData: (_, __) => refetchFileData(),
    },
  });

  return (
    <>
      {current.matches('broadCategoriesModal') ? (
        <BroaderCategoriesModalContainer
          onClose={() => send('CLOSE_BROAD_CATEGORIES_MODAL_REJECT')}
          onClickYes={() => send('CLICK_ACCEPT_BROAD_CATEGORIES_MODAL')}
        />
      ) : null}
      <div className={spacedChildrenClass}>
        <AddCategoryContainer
          onHitEnterKey={() => send('CLICK_CREATE_NEW_CATEGORY')}
          onChooseSearchResultCategory={(category) =>
            send('CHOOSE_CATEGORY_TO_ASSIGN', {
              category: category,
            })
          }
          onChangeInputSearchQuery={(searchQuery) =>
            send('INPUT_SEARCH_QUERY_CHANGED', { searchQuery })
          }
        />
        <Button
          title="Associate category to this file"
          icon="plus"
          color="blue"
          size="medium"
          onClick={() => send('CLICK_CREATE_NEW_CATEGORY')}
        />
      </div>
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
