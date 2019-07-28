import React from 'react';
import PropTypes from 'prop-types';
import { useMachine } from '@xstate/react';

import { RECEIVE_ENTITIES } from './actionTypes';
import machine from './machine';
import getSqlDriver from '../../sqlDriver';
import store from '../../redux/store';
import { selectCategorizedFiles } from './sqlQueries';
import CategoryMenuContainer from './containers/CategoryMenuContainer';
import queryChildCategories from '../../query-functions/queryChildCategories';
import DeleteAssociatedCategoryModal from './components/DeleteAssociatedCategoryModal';
import queryCategoryNameAndParentId from '../../query-functions/queryCategoryName';
import CategoryNameWidget from './CategoryNameWidget/CategoryNameWidget';
import { Divider, Grid } from 'semantic-ui-react';

const getCategory = (store) => (store && store.categoryScreen ? store.categoryScreen.category : {});

const fetchCategoryData = async (categoryId) => {
  const { name: categoryName, parent_id: parentCategoryId } = await queryCategoryNameAndParentId(
    categoryId,
  );
  const category = {
    id: categoryId,
    name: categoryName,
  };
  const isRootCategory = parentCategoryId === null;
  return Promise.resolve({ category, isRootCategory: isRootCategory });
};

const updateCategoryData = (category, isRootCategory) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      category: category,
      isRootCategory: isRootCategory,
    },
  });
};

const queryCategorizedFiles = (categoryId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectCategorizedFiles,
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

const fetchSubcategories = async () => {
  const category = getCategory(store.getState());
  const subcategories = await queryChildCategories(category.id);
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      subcategories: subcategories,
    },
  });
};

const getSubcategories = (store) =>
  store && store.categoryScreen ? store.categoryScreen.subcategories : [];

const getCategorizedFiles = (store) =>
  store && store.categoryScreen ? store.categoryScreen.categorizedFiles : [];

const checkSubcategoriesEmpty = () => {
  const subcategories = getSubcategories(store.getState());
  return subcategories.length === 0 ? Promise.resolve() : Promise.reject();
};

const fetchCategorizedFiles = async () => {
  const category = getCategory(store.getState());
  const categorizedFiles = await queryCategorizedFiles(category.id);
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      categorizedFiles: categorizedFiles,
    },
  });
};

const checkCategorizedFilesEmpty = () => {
  const categorizedFiles = getCategorizedFiles(store.getState());
  return categorizedFiles.length === 0 ? Promise.resolve() : Promise.reject();
};

const updateNewCategoryName = (category) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      newCategoryName: category.name,
    },
  });
};

const machineWithConfig = machine.withConfig({
  services: {
    fetchCategoryData: (context, __) => fetchCategoryData(context.categoryId),
    fetchSubcategories: (_, __) => fetchSubcategories(),
    checkSubcategoriesEmpty: (_, __) => checkSubcategoriesEmpty(),
    fetchCategorizedFiles: (_, __) => fetchCategorizedFiles(),
    checkCategorizedFilesEmpty: (_, __) => checkCategorizedFilesEmpty(),
  },
  actions: {
    updateCategoryData: (_, event) =>
      updateCategoryData(event.data.category, event.data.isRootCategory),
    updateNewCategoryName: (_, event) => updateNewCategoryName(event.data.category),
  },
});

const CategoryScreen = ({ categoryId }) => {
  const [current, send] = useMachine(
    machineWithConfig.withContext({
      categoryId: categoryId,
    }),
  );
  if (current.matches('idle') || current.matches('fetchingCategoryData')) {
    return (
      <Grid>
        <Grid.Column width="3" />
        <Grid.Column width="10">
          <DeleteAssociatedCategoryModal
            isOpen={current.matches('idle.deleteCategoryStepsModal')}
            onClose={() => send('CLICK_CLOSE_MODAL')}
            onConfirmDelete={() => send('DELETE_CATEGORY_MODAL_CONFIRM_DELETE')}
          />
          <CategoryNameWidget refetchCategoryData={() => send('REFETCH_CATEGORY_DATA')} />
          <Divider horizontal />
          <CategoryMenuContainer
            onClickDeleteCategory={(category) =>
              send('CLICK_DELETE_CATEGORY', {
                category: category,
              })
            }
          />
          {current.matches('idle.failure') ? <h2 style={{ color: 'red' }}>Failed</h2> : null}
        </Grid.Column>
        <Grid.Column width="3" />
      </Grid>
    );
  } else if (current.matches('fetchingFailed')) {
    return <h2 style={{ color: 'red' }}>Error: failed to fetch category data</h2>;
  } else if (current.matches('deletedCategory')) {
    return <h2 style={{ color: 'green' }}>Deleted category successfully</h2>;
  } else {
    return <h2>Unknown error</h2>;
  }
};

CategoryScreen.propTypes = {
  categoryId: PropTypes.number.isRequired,
};

export default CategoryScreen;
