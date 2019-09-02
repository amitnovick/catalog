import React from 'react';
import PropTypes from 'prop-types';
import { useMachine } from '@xstate/react';

import machine from './machine';
import queryRootCategory from '../../db/queries/queryRootCategory';
import queryChildCategories from '../../db/queries/queryChildCategories';

import queryCategoriesInPath from '../../db/queries/queryCategoriesInPath';
import CategoryRenameModalWidget from './CategoryRenameModalWidget/CategoryRenameModalWidget';
import { assign } from 'xstate';
import Explorer from './Explorer/Explorer';
import CategoryDeleteModalWidget from './CategoryDeleteModalWidget/CategoryDeleteModalWidget';
import CategoryAdditionModalWidget from './CategoryAdditionModalWidget/CategoryAdditionModalWidget';
import CategoryMoveToModalWidget from './CategoryMoveToModalWidget/CategoryMoveToModalWidget';
import querySelectFsResourcesOfCategory from '../../db/queries/querySelectFsResourcesOfCategory';
import ReactContext from './ReactContext';
import { Message } from 'semantic-ui-react';

const fetchData = async (currentCategoryId) => {
  const categoriesInPath =
    currentCategoryId === null
      ? await queryRootCategory().then((rootCategory) => [rootCategory])
      : await queryCategoriesInPath(currentCategoryId);

  const representorCategory = categoriesInPath[categoriesInPath.length - 1];

  const fsResources = await querySelectFsResourcesOfCategory(representorCategory.id);

  const childCategories = await queryChildCategories(representorCategory.id);

  return Promise.resolve({
    categoriesInPath,
    fsResources,
    childCategories,
  });
};

const selectCategoryRowByName = (newCategoryName, categories) => {
  const categoriesWithSameName = categories.filter((category) => category.name === newCategoryName);

  if (categoriesWithSameName.length > 0) {
    const newCategory = categoriesWithSameName[0];
    return newCategory;
  } else {
    return null;
  }
};

const selectCategoryRowById = (category, fetchedCategories) => {
  const categoriesWithSameId = fetchedCategories.filter(
    (fetchedCategory) => fetchedCategory.id === category.id,
  );
  if (categoriesWithSameId.length > 0) {
    const newCategory = categoriesWithSameId[0];
    return newCategory;
  } else {
    return null;
  }
};

const checkIsSelectedRowToBeDeleted = (modalCategory, selectedCategory) => {
  return (
    modalCategory !== null && selectedCategory !== null && modalCategory.id === selectedCategory.id
  );
};

const machineWithServices = machine.withConfig({
  services: {
    fetchData: (context, _) => fetchData(context.initialCategoryId),
  },
  actions: {
    updateState: assign({
      categoriesInPath: (_, event) => event.data.categoriesInPath,
      fsResources: (_, event) => event.data.fsResources,
      childCategories: (_, event) => event.data.childCategories,
    }),
    updateCategoryRenamingModalCategory: assign({
      categoryRenamingModalCategory: (_, event) => event.category,
    }),
    updateCategoryDeletionModalCategory: assign({
      categoryDeletionModalCategory: (_, event) => event.category,
    }),
    updateCategoryMoveToModalCategory: assign({
      categoryMoveToModalCategory: (_, event) => event.category,
    }),
    updateSelectedCategoryRow: assign({
      selectedCategoryRow: (_, event) => event.category,
    }),
    updateSelectedFsResourceRow: assign({
      selectedFsResourceRow: (_, event) => event.fsResource,
    }),
    clearSelectedCategoryRow: assign({
      selectedCategoryRow: (_, __) => null,
    }),
    assignSelectedCategoryRowByName: assign({
      selectedCategoryRow: (context, event) =>
        selectCategoryRowByName(context.newCategoryName, event.data.childCategories),
    }),
    assignSelectedCategoryRowById: assign({
      selectedCategoryRow: (context, event) =>
        selectCategoryRowById(context.categoryRenamingModalCategory, event.data.childCategories),
    }),
    updateNewCategoryName: assign({
      newCategoryName: (_, event) => event.newCategoryName,
    }),
    updateErrorMessage: assign({
      errorMessage: (_, event) => event.data.message,
    }),
  },
  guards: {
    checkIsSelectedRowToBeDeleted: (context, _) =>
      checkIsSelectedRowToBeDeleted(
        context.categoryDeletionModalCategory,
        context.selectedCategoryRow,
      ),
  },
});

const ExplorerScreen = ({ initialCategoryId }) => {
  const categoriesListRef = React.useRef();

  const [current, send, service] = useMachine(
    machineWithServices.withContext({
      ...machineWithServices.initialState.context,
      initialCategoryId: initialCategoryId,
      categoriesListRef: categoriesListRef,
    }),
    {
      actions: {
        scrollToCategoryRow: (context, _) =>
          categoriesListRef.current.scrollToItem(
            context.childCategories.findIndex(
              (category) => category.id === context.selectedCategoryRow.id,
            ),
          ),
      },
      devTools: true,
    },
  );
  const {
    categoryRenamingModalCategory,
    categoryDeletionModalCategory,
    categoryMoveToModalCategory,
    categoriesInPath,
    errorMessage,
  } = current.context;

  const currentCategory =
    categoriesInPath !== undefined ? categoriesInPath[categoriesInPath.length - 1] : null;

  if (
    current.matches('processes.idle') ||
    current.matches('processes.fetchingData') ||
    current.matches('processes.fetchingNewCategoryDataAndAssigningSelectedCategoryRow') ||
    current.matches('processes.fetchingRenamedCategoryDataAndAssigningSelectedCategoryRow') ||
    current.matches('processes.categoryRenamingModal') ||
    current.matches('processes.categoryDeletionModal') ||
    current.matches('processes.categoryAdditionModal') ||
    current.matches('processes.categoryMoveToModal')
  ) {
    return (
      <ReactContext.Provider value={service}>
        {current.matches('processes.idle') ? (
          <Explorer categoriesInPath={categoriesInPath} />
        ) : null}
        {current.matches('processes.categoryRenamingModal') ? (
          <CategoryRenameModalWidget
            category={categoryRenamingModalCategory}
            onClose={() => send('CATEGORY_RENAMING_MODAL_CANCEL')}
            refetchCategoryData={() => send('CATEGORY_RENAMING_MODAL_SUBMIT')}
          />
        ) : null}
        {current.matches('processes.categoryDeletionModal') ? (
          <CategoryDeleteModalWidget
            category={categoryDeletionModalCategory}
            onClose={() => send('CATEGORY_DELETION_MODAL_CANCEL')}
            onConfirmDelete={() => send('CATEGORY_DELETION_MODAL_SUBMIT')}
          />
        ) : null}
        {current.matches('processes.categoryAdditionModal') ? (
          <CategoryAdditionModalWidget
            parentCategoryId={currentCategory.id}
            onClose={() => send('CATEGORY_ADDITION_MODAL_CANCEL')}
            refetchCategoryData={(newCategoryName) =>
              send('CATEGORY_ADDITION_MODAL_SUBMIT', { newCategoryName })
            }
          />
        ) : null}
        {current.matches('processes.categoryMoveToModal') ? (
          <CategoryMoveToModalWidget
            childCategory={categoryMoveToModalCategory}
            onClose={() => send('CATEGORY_MOVE_TO_MODAL_CANCEL')}
            onFinish={() => send('CATEGORY_MOVE_TO_MODAL_SUBMIT')}
          />
        ) : null}
      </ReactContext.Provider>
    );
  } else if (current.matches('processes.failure')) {
    return <Message error>{errorMessage}</Message>;
  } else {
    return <h2>Unknown state</h2>;
  }
};

ExplorerScreen.propTypes = {
  initialCategoryId: PropTypes.any,
};

export default ExplorerScreen;
