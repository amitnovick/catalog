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
import queryFiles from '../../db/queries/queryFiles';
import ReactContext from './ReactContext';

const fetchData = async (currentCategoryId) => {
  const categoriesInPath =
    currentCategoryId === null
      ? await queryRootCategory().then((rootCategory) => [rootCategory])
      : await queryCategoriesInPath(currentCategoryId);

  const representorCategory = categoriesInPath[categoriesInPath.length - 1];

  const files = await queryFiles(representorCategory.id);

  const childCategories = await queryChildCategories(representorCategory.id);

  return Promise.resolve({
    categoriesInPath,
    files,
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

const machineWithServices = machine.withConfig({
  services: {
    fetchData: (context, _) => fetchData(context.initialCategoryId),
  },
  actions: {
    updateState: assign({
      categoriesInPath: (_, event) => event.data.categoriesInPath,
      files: (_, event) => event.data.files,
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
    updateSelectedFileRow: assign({
      selectedFileRow: (_, event) => event.file,
    }),
    clearSelectedCategoryRow: assign({
      selectedCategoryRow: (_, __) => null,
    }),
    assignSelectedCategoryRowByName: assign({
      selectedCategoryRow: (context, event) =>
        selectCategoryRowByName(
          context.categoryRenamingModalChosenNewCategoryName,
          event.data.childCategories,
        ),
    }),
    assignSelectedCategoryRowById: assign({
      selectedCategoryRow: (context, event) =>
        selectCategoryRowById(context.categoryRenamingModalCategory, event.data.childCategories),
    }),
    updateNewCategoryName: assign({
      newCategoryName: (_, event) => event.newCategoryName,
    }),
  },
});

const GraphExplorerScreen = ({ initialCategoryId }) => {
  const [current, send, service] = useMachine(
    machineWithServices.withContext({
      ...machineWithServices.initialState.context,
      initialCategoryId: initialCategoryId,
    }),
    { devTools: true },
  );
  const {
    categoryRenamingModalCategory,
    categoryDeletionModalCategory,
    categoryMoveToModalCategory,
    categoriesInPath,
  } = current.context;

  const currentCategory =
    categoriesInPath !== undefined ? categoriesInPath[categoriesInPath.length - 1] : null;

  if (
    current.matches('idle.fetchingData') ||
    current.matches('idle.idle') ||
    current.matches('categoryRenamingModal') ||
    current.matches('categoryDeletionModal') ||
    current.matches('categoryAdditionModal') ||
    current.matches('categoryMoveToModal')
  ) {
    return (
      <ReactContext.Provider value={service}>
        {current.matches('idle.idle') ? <Explorer categoriesInPath={categoriesInPath} /> : null}
        {current.matches('categoryRenamingModal') ? (
          <CategoryRenameModalWidget
            category={categoryRenamingModalCategory}
            onClose={() => send('CATEGORY_RENAMING_MODAL_CANCEL')}
            refetchCategoryData={() => send('CATEGORY_RENAMING_MODAL_SUBMIT')}
          />
        ) : null}
        {current.matches('categoryDeletionModal') ? (
          <CategoryDeleteModalWidget
            category={categoryDeletionModalCategory}
            onClose={() => send('CATEGORY_DELETION_MODAL_CANCEL')}
            onConfirmDelete={() => send('CATEGORY_DELETION_MODAL_SUBMIT')}
          />
        ) : null}
        {current.matches('categoryAdditionModal') ? (
          <CategoryAdditionModalWidget
            parentCategoryId={currentCategory.id}
            onClose={() => send('CATEGORY_ADDITION_MODAL_CANCEL')}
            refetchCategoryData={(newCategoryName) =>
              send('CATEGORY_ADDITION_MODAL_SUBMIT', { newCategoryName })
            }
          />
        ) : null}
        {current.matches('categoryMoveToModal') ? (
          <CategoryMoveToModalWidget
            childCategory={categoryMoveToModalCategory}
            onClose={() => send('CATEGORY_MOVE_TO_MODAL_CANCEL')}
            onFinish={() => send('CATEGORY_MOVE_TO_MODAL_SUBMIT')}
          />
        ) : null}
      </ReactContext.Provider>
    );
  } else if (current.matches('idle.failure')) {
    return <h2>Failure</h2>;
  } else {
    return <h2>Unknown state</h2>;
  }
};

GraphExplorerScreen.propTypes = {
  initialCategoryId: PropTypes.any,
};

export default GraphExplorerScreen;
