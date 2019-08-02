import React from 'react';
import PropTypes from 'prop-types';
import { useMachine } from '@xstate/react';
import { Grid, Divider, Segment } from 'semantic-ui-react';

import getSqlDriver from '../../sqlDriver';
import machine from './machine';
import { selectFiles } from '../../sql_queries';
import queryRootCategory from '../../query-functions/queryRootCategory';
import queryChildCategories from '../../query-functions/queryChildCategories';

import queryCategoriesInPath from '../../query-functions/queryCategoriesInPath';
import CategoryRenameModalWidget from './CategoryRenameModalWidget/CategoryRenameModalWidget';
import { assign } from 'xstate';
import ExplorerWidget from './ExplorerWidget/ExplorerWidget';
import CategoryDeleteModalWidget from './CategoryDeleteModalWidget/CategoryDeleteModalWidget';
import CategoryAdditionModalWidget from './CategoryAdditionModalWidget/CategoryAdditionModalWidget';
import CategoryMoveToModalWidget from './CategoryMoveToModalWidget/CategoryMoveToModalWidget';

const queryFiles = (categoryId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectFiles,
      {
        $category_id: categoryId,
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
      categoryRenamingModalCategory: (_, event) => event.categoryRenamingModalCategory,
    }),
    updateCategoryDeletionModalCategory: assign({
      categoryDeletionModalCategory: (_, event) => event.category,
    }),
    updateCategoryMoveToModalCategory: assign({
      categoryMoveToModalCategory: (_, event) => event.category,
    }),
  },
});

const GraphExplorerScreen = ({ initialCategoryId }) => {
  const [current, send] = useMachine(
    machineWithServices.withContext({
      initialCategoryId: initialCategoryId,
    }),
    { devTools: true },
  );
  const {
    categoryRenamingModalCategory,
    categoryDeletionModalCategory,
    categoryMoveToModalCategory,
    childCategories,
    files,
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
      <>
        <Divider horizontal />
        <Grid>
          <Grid.Column width="3" />
          <Grid.Column width="10">
            <Segment style={{ minHeight: '90vh' }}>
              {current.matches('idle.idle') ? (
                <ExplorerWidget
                  categories={childCategories}
                  files={files}
                  categoriesInPath={categoriesInPath}
                  onClickRenameButton={(category) =>
                    send('CLICK_CATEGORY_RENAME_BUTTON', {
                      categoryRenamingModalCategory: category,
                    })
                  }
                  onClickMoveToButton={(category) =>
                    send('CLICK_CATEGORY_MOVE_TO__BUTTON', { category })
                  }
                  onClickDeleteButton={(category) =>
                    send('CLICK_CATEGORY_DELETE_BUTTON', { category })
                  }
                  onClickAddCategoryButton={() => send('CLICK_ADD_CATEGORY_BUTTON')}
                />
              ) : null}
            </Segment>
          </Grid.Column>
          <Grid.Column width="3" />
        </Grid>
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
            refetchCategoryData={() => send('CATEGORY_ADDITION_MODAL_SUBMIT')}
          />
        ) : null}
        {current.matches('categoryMoveToModal') ? (
          <CategoryMoveToModalWidget
            childCategory={categoryMoveToModalCategory}
            onClose={() => send('CATEGORY_MOVE_TO_MODAL_CANCEL')}
            onFinish={() => send('CATEGORY_MOVE_TO_MODAL_SUBMIT')}
          />
        ) : null}
      </>
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
