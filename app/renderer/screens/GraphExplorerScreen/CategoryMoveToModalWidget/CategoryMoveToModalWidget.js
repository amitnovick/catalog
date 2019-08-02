import React from 'react';
import { useMachine } from '@xstate/react';
import machine from './machine';
import { assign } from 'xstate';
import queryDeleteCategoryOfFilesWhenMovingCategory from '../../../query-functions/queryDeleteCategoryOfFilesWhenMovingCategory';
import queryCategoriesInPath from '../../../query-functions/queryCategoriesInPath';
import MoveToModal from './MoveToModal/MoveToModal';
import ReactContext from './ReactContext';
import queryUpdateCategoryParentId from '../../../query-functions/queryUpdateCategoryParentId';

const checkIsParentCategoryValid = async (childCategory, parentCategory) => {
  const childCategoryAncestors = await queryCategoriesInPath(parentCategory.id);
  const isParentCategoryAnAncestor = childCategoryAncestors
    .map((ancestor) => ancestor.id)
    .includes(childCategory.id);
  if (isParentCategoryAnAncestor) {
    const errorMessage = `Category ${parentCategory.name} is either the same category or a descendant of ${childCategory.name}`;
    return Promise.reject(new Error(errorMessage));
  } else {
    return Promise.resolve();
  }
};

const deleteParentCategoryOfFilesWithBothParentAndChild = (childCategory, parentCategory) => {
  return queryDeleteCategoryOfFilesWhenMovingCategory(childCategory.id, parentCategory.id);
};

const updateParentCategoryOfChildCategory = (childCategory, parentCategory) => {
  return queryUpdateCategoryParentId(childCategory.id, parentCategory.id);
};

const machineWithConfig = machine.withConfig({
  services: {
    checkIsParentCategoryValid: (context, _) =>
      checkIsParentCategoryValid(context.childCategory, context.chosenParentCategory),
    deleteParentCategoryOfFilesWithBothParentAndChild: (context, _) =>
      deleteParentCategoryOfFilesWithBothParentAndChild(
        context.childCategory,
        context.chosenParentCategory,
      ),
    updateParentCategoryOfChildCategory: (context, _) =>
      updateParentCategoryOfChildCategory(context.childCategory, context.chosenParentCategory),
  },
  actions: {
    updateChosenParentCategory: assign({
      chosenParentCategory: (_, event) => event.chosenParentCategory,
    }),
    updateErrorMessage: assign({ errorMessage: (_, event) => event.data.message }),
  },
});

const CategoryMoveToModalWidget = ({ childCategory, onFinish, onClose }) => {
  const [_, __, service] = useMachine(
    machineWithConfig
      .withContext({
        childCategory: childCategory,
      })
      .withConfig({
        actions: {
          onFinish: (_, __) => onFinish(),
          onClose: (_, __) => onClose(),
        },
      }),
  );
  return (
    <ReactContext.Provider value={service}>
      <MoveToModal onClose={onClose} />
    </ReactContext.Provider>
  );
};

export default CategoryMoveToModalWidget;
