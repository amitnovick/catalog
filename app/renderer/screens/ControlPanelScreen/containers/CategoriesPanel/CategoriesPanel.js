import React from 'react';
import { useMachine } from '@xstate/react';

import machine from './machine';
import { insertCategory, updateRelationship } from '../../../../sql_queries';
import getSqlDriver from '../../../../sqlDriver';
import AddNewCategoryContainer from '../AddNewCategoryContainer';
import CreateSubcategoryRelationshipContainer from '../CreateSubcategoryRelationshipContainer';
import queryRootCategory from '../../../../query-functions/queryRootCategory';

const categoryNameAlreadyExistsErrorMessage =
  'SQLITE_CONSTRAINT: UNIQUE constraint failed: categories.name';

const addNewCategory = async categoryName => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      insertCategory,
      {
        $category_name: categoryName
      },
      function(err) {
        if (err) {
          if (err.message === categoryNameAlreadyExistsErrorMessage) {
            console.log('Category name already exists!');
          }
          reject();
        } else {
          const { changes: affectedRowsCount } = this;
          if (affectedRowsCount !== 1) {
            reject();
          } else {
            resolve();
          }
        }
      }
    );
  });
};

const createRelationship = async (supercategoryName, subcategoryName) => {
  const rootCategory = await queryRootCategory();

  return new Promise(async (resolve, reject) => {
    if (
      subcategoryName === rootCategory.name ||
      subcategoryName.trim() === ''
    ) {
      reject();
    } else {
      getSqlDriver().run(
        updateRelationship,
        {
          $parent_name: supercategoryName,
          $child_name: subcategoryName
        },
        function(err) {
          if (err) {
            console.log('err:', err);
            reject();
          } else {
            const { changes: affectedRowsCount } = this;
            if (affectedRowsCount !== 1) {
              reject();
            } else {
              resolve();
            }
          }
        }
      );
    }
  });
};

const machineWithServices = machine.withConfig({
  services: {
    addNewCategory: (_, event) => addNewCategory(event.tag),
    createRelationship: (_, event) =>
      createRelationship(event.parentTag, event.childTag)
  }
});

const CategoriesPanel = () => {
  const [current, send] = useMachine(machineWithServices);

  const addNewCategory = categoryName =>
    send('ADD_NEW_CATEGORY', { tag: categoryName });

  const createRelationship = (supercategoryName, subcategoryName) =>
    send('CREATE_RELATIONSHIP', {
      parentTag: supercategoryName,
      childTag: subcategoryName
    });

  if (
    ['loadingAddingNewCategory', 'loadingCreatingRelationship'].includes(
      current.value
    )
  ) {
    return <h2>loading...</h2>;
  } else if (current.matches('idle')) {
    return (
      <React.Fragment>
        <h1>Add category (default parent: Root) </h1>
        <AddNewCategoryContainer onClickAddCategory={addNewCategory} />
        <h1>Create relationship</h1>
        <CreateSubcategoryRelationshipContainer
          onClickCreateRelationship={createRelationship}
        />
        {current.matches('idle.success') ? (
          <h2 style={{ color: 'green' }}>Succeeded</h2>
        ) : null}
        {current.matches('idle.failure') ? (
          <h2 style={{ color: 'red' }}>Failed</h2>
        ) : null}
      </React.Fragment>
    );
  } else {
    return <h2>Unknown state</h2>;
  }
};

export default CategoriesPanel;
