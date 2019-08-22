import React from 'react';
import { useMachine } from '@xstate/react';

import machine from './machine';

import querySelectCategoriesWithMatchingName from '../../../db/queries/querySelectCategoriesWithMatchingName';
import queryDeleteFileCategory from '../../../db/queries/queryDeleteCategoryOfFsResource';
import { Message, Label, Button } from 'semantic-ui-react';
import BroaderCategoriesModal from './Modal/BroaderCategoriesModal';
import addNewCategoryUnderRoot from '../../../db/queries/addNewCategoryUnderRoot';
import queryGetCategoryByName from '../../../db/queries/queryGetCategoryByName';
import { css } from 'emotion';
import queryCategoryAncestors from '../../../db/queries/queryCategoryAncestors';
import queryAddCategoryToFsResource from '../../../db/queries/queryAddCategoryToFsResource';
import { assign } from 'xstate';
import SearchCategory from '../../../components/SearchCategory';

const spacedChildrenClass = css`
  & > * {
    margin: 0px 10px;
  }
`;

const fetchSearchResultCategories = (searchQuery) => {
  return querySelectCategoriesWithMatchingName(searchQuery);
};

const getBroaderFileCategoriesFromDb = async (categoryId, fileCategories) => {
  const categoryAncestors = await queryCategoryAncestors(categoryId);
  const categoryAncestorIds = categoryAncestors.map(({ id }) => id);
  const broaderFileCategories = fileCategories.filter((fileCategory) =>
    categoryAncestorIds.includes(fileCategory.id),
  );
  return Promise.resolve(broaderFileCategories);
};

const fetchBroaderCategoriesOfFile = async (chosenSearchResultCategory, categories) => {
  return getBroaderFileCategoriesFromDb(chosenSearchResultCategory.id, categories); // TODO: Think of more elaborate way to handle an error here, it should not cause transition to `attemptingToCreateRelationshipLoading` but to some other state that shows that an error occurred.
};

const removeBroaderFileCategoriesIfExist = async (categoryId, fileId, categories) => {
  const broaderFileCategories = await getBroaderFileCategoriesFromDb(categoryId, categories);
  for (let i = 0; i < broaderFileCategories.length; i++) {
    const broaderFileCategory = broaderFileCategories[i];
    await queryDeleteFileCategory(broaderFileCategory.id, fileId);
  }
};

const fetchNarrowerCategoriesOfFileInDb = async (category, fileCategories) => {
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

const fetchNarrowerCategoriesOfFile = async (chosenSearchResultCategory, categories) => {
  return fetchNarrowerCategoriesOfFileInDb(chosenSearchResultCategory, categories);
};

const replaceBroaderCategoriesWithNarrowerCategoryInDb = async (
  file,
  chosenSearchResultCategory,
  categories,
) => {
  await removeBroaderFileCategoriesIfExist(chosenSearchResultCategory.id, file.id, categories);
  return queryAddCategoryToFsResource(file.id, chosenSearchResultCategory);
};

const areNarrowerCategoriesOfFileEmpty = (narrowerCategoriesOfFile) => {
  return narrowerCategoriesOfFile.length === 0;
};

const areBroaderCategoriesOfFileEmpty = (broaderCategoriesOfFile) => {
  return broaderCategoriesOfFile.length === 0;
};

const attemptToAddChosenSearchResultCategory = (file, chosenSearchResultCategory) => {
  return queryAddCategoryToFsResource(file.id, chosenSearchResultCategory);
};

const categoryIsntAlreadyAssigned = (category, categories) => {
  const categoriesIds = categories.map((category) => category.id);
  return categoriesIds.includes(category.id) === false;
};

const isInputCategoryNameWhitespace = (inputSearchQuery) => {
  return inputSearchQuery.trim() !== '';
};

const createNewCategory = async (newCategoryName) => {
  await addNewCategoryUnderRoot(newCategoryName);
  const newCategoryId = await queryGetCategoryByName(newCategoryName);
  const newCategory = {
    name: newCategoryName,
    id: newCategoryId,
  };
  return Promise.resolve(newCategory);
};

const fetchExistingCategoryAndAssign = async (categoryName) => {
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
    fetchBroaderCategoriesOfFile: (context, _) =>
      fetchBroaderCategoriesOfFile(context.chosenSearchResultCategory, context.categories),
    replaceBroaderCategoriesWithNarrowerCategoryInDb: (context, _) =>
      replaceBroaderCategoriesWithNarrowerCategoryInDb(
        context.file,
        context.chosenSearchResultCategory,
        context.categories,
      ),
    fetchNarrowerCategoriesOfFile: (context, _) =>
      fetchNarrowerCategoriesOfFile(context.chosenSearchResultCategory, context.categories),
    attemptToAddChosenSearchResultCategory: (context, _) =>
      attemptToAddChosenSearchResultCategory(context.file, context.chosenSearchResultCategory),
    createNewCategory: (context, _) => createNewCategory(context.inputSearchQuery),
    fetchExistingCategoryAndAssign: (context, _) =>
      fetchExistingCategoryAndAssign(context.inputSearchQuery),
  },
  actions: {
    updateInputSearchQuery: assign({ inputSearchQuery: (_, event) => event.searchQuery }),
    updateChosenSearchResultCategory: assign({
      chosenSearchResultCategory: (_, event) => event.category,
    }),
    updateSyntheticallyChosenSearchResultCategory: assign({
      chosenSearchResultCategory: (_, event) => event.data,
    }),
    updateSearchResultCategories: assign({ searchResultCategories: (_, event) => event.data }),
    updateErrorMessage: assign({ genericErrorAddCategoryWidget: (_, event) => event.data.message }),
    updateNarrowerCategoriesOfFile: assign({ narrowerCategoriesOfFile: (_, event) => event.data }),
    updateBroaderFileCategories: assign({ broaderFileCategories: (_, event) => event.data }),
  },
  guards: {
    areNarrowerCategoriesOfFileEmpty: (_, event) => areNarrowerCategoriesOfFileEmpty(event.data),
    areBroaderCategoriesOfFileEmpty: (_, event) => areBroaderCategoriesOfFileEmpty(event.data),
    categoryIsntAlreadyAssigned: (context, event) =>
      categoryIsntAlreadyAssigned(event.category, context.categories),
    isCategoryNameWhitespace: (context, _) =>
      isInputCategoryNameWhitespace(context.inputSearchQuery),
  },
});

const AddCategoryWidget = ({ file, categories, refetchFileData }) => {
  const [current, send] = useMachine(
    machineWithConfig.withContext({
      ...machineWithConfig.initialState.context,
      file: file,
      categories: categories,
    }),
    {
      actions: {
        refetchFileData: (_, __) => refetchFileData(),
      },
    },
  );

  const {
    genericErrorAddCategoryWidget: errorMessage,
    narrowerCategoriesOfFile,
    searchResultCategories,
    inputSearchQuery,
    broaderFileCategories,
  } = current.context;
  return (
    <>
      {current.matches('broadCategoriesModal') ? (
        <BroaderCategoriesModal
          broaderCategories={broaderFileCategories}
          onClose={() => send('CLOSE_BROAD_CATEGORIES_MODAL_REJECT')}
          onClickYes={() => send('CLICK_ACCEPT_BROAD_CATEGORIES_MODAL')}
        />
      ) : null}
      {current.matches('idle') || current.matches('fetchingSearchResultCategories') ? (
        <div className={spacedChildrenClass}>
          <SearchCategory
            searchResultCategories={searchResultCategories}
            inputSearchQuery={inputSearchQuery}
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
      ) : null}

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

export default AddCategoryWidget;
