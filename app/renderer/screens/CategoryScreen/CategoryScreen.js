import React from 'react';
import PropTypes from 'prop-types';
import { useMachine } from '@xstate/react';

import { RECEIVE_ENTITIES } from './actionTypes';
import machine from './machine';
import getSqlDriver from '../../sqlDriver';
import store from '../../redux/store';
import { updateCategoryName, selectCategorizedFiles } from './sqlQueries';
import CategoryMenuContainer from './containers/CategoryMenuContainer';
import queryChildCategories from '../../query-functions/queryChildCategories';
import DeleteAssociatedCategoryModal from './components/DeleteAssociatedCategoryModal';
import queryCategoryNameAndParentId from '../../query-functions/queryCategoryName';

const getCategory = store =>
  store && store.categoryScreen ? store.categoryScreen.category : {};

const fetchCategoryData = async categoryId => {
  const {
    name: categoryName,
    parent_id: parentCategoryId
  } = await queryCategoryNameAndParentId(categoryId);
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      category: {
        id: categoryId,
        name: categoryName,
        isRoot: parentCategoryId === null
      }
    }
  });
};

const newCategoryNameAlreadyExistsErrorMessage = `SQLITE_CONSTRAINT: UNIQUE constraint failed: categories.name`;

const queryRenameCategory = (categoryId, newCategoryName) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      updateCategoryName,
      {
        $category_id: categoryId,
        $category_name: newCategoryName
      },
      function(err) {
        if (err) {
          if (err.message === newCategoryNameAlreadyExistsErrorMessage) {
            console.log('Error: category name is taken by another category');
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
      }
    );
  });
};

const queryCategorizedFiles = categoryId => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectCategorizedFiles,
      {
        $category_id: categoryId
      },
      (err, rows) => {
        if (err) {
          console.log('err:', err);
          reject();
        } else {
          resolve(rows);
        }
      }
    );
  });
};

const attemptRenameCategory = async (category, newCategoryName) => {
  return await queryRenameCategory(category.id, newCategoryName);
};

const fetchSubcategories = async () => {
  const category = getCategory(store.getState());
  const subcategories = await queryChildCategories(category.id);
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      subcategories: subcategories
    }
  });
};

const getSubcategories = store =>
  store && store.categoryScreen ? store.categoryScreen.subcategories : [];

const getCategorizedFiles = store =>
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
      categorizedFiles: categorizedFiles
    }
  });
};

const checkCategorizedFilesEmpty = () => {
  const categorizedFiles = getCategorizedFiles(store.getState());
  return categorizedFiles.length === 0 ? Promise.resolve() : Promise.reject();
};

const machineWithConfig = machine.withConfig({
  services: {
    fetchCategoryData: (context, __) => fetchCategoryData(context.categoryId),
    attemptRenameCategory: (_, event) =>
      attemptRenameCategory(event.category, event.newCategoryName),
    fetchSubcategories: (_, __) => fetchSubcategories(),
    checkSubcategoriesEmpty: (_, __) => checkSubcategoriesEmpty(),
    fetchCategorizedFiles: (_, __) => fetchCategorizedFiles(),
    checkCategorizedFilesEmpty: (_, __) => checkCategorizedFilesEmpty()
  }
});

const CategoryScreen = ({ categoryId }) => {
  const [current, send] = useMachine(
    machineWithConfig.withContext({
      categoryId: categoryId
    })
  );
  if (current.matches('loading')) {
    return <h2>Loading...</h2>;
  } else if (current.matches('idle')) {
    return (
      <>
        <DeleteAssociatedCategoryModal
          isOpen={current.matches('idle.deleteCategoryStepsModal')}
          onClose={() => send('CLICK_CLOSE_MODAL')}
          onConfirmDelete={() => send('DELETE_CATEGORY_MODAL_CONFIRM_DELETE')}
        />
        <CategoryMenuContainer
          onClickRenameCategory={(category, newCategoryName) =>
            send('CLICK_RENAME_CATEGORY', {
              category: category,
              newCategoryName: newCategoryName
            })
          }
          onClickDeleteCategory={category =>
            send('CLICK_DELETE_CATEGORY', {
              category: category
            })
          }
        />
        {current.matches('idle.failure') ? (
          <h2 style={{ color: 'red' }}>Failed</h2>
        ) : null}
      </>
    );
  } else if (current.matches('fetchingFailed')) {
    return (
      <h2 style={{ color: 'red' }}>Error: failed to fetch category data</h2>
    );
  } else if (current.matches('deletedCategory')) {
    return <h2 style={{ color: 'green' }}>Deleted category successfully</h2>;
  } else {
    return <h2>Unknown error</h2>;
  }
};

CategoryScreen.propTypes = {
  categoryId: PropTypes.number.isRequired
};

export default CategoryScreen;
