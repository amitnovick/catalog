import React from 'react';
import { useMachine } from '@xstate/react';

import machine from './machine';
import store from '../../../redux/store';
import { RECEIVE_ENTITIES } from '../actionTypes';
import RenameModal from './components/RenameModal';
import queryRenameCategory from '../query-functions/queryRenameCategory';

const attemptToRenameCategory = (category, newCategoryName) => {
  return queryRenameCategory(category.id, newCategoryName);
};

const updateNewCategoryName = (inputText) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      categoryRenameModalInputText: inputText,
    },
  });
};

const getCategory = (store) => (store && store.categoryScreen ? store.categoryScreen.category : {});

const resetNewCategoryNameToCategoryName = () => {
  const category = getCategory(store.getState());
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      categoryRenameModalInputText: category.name,
    },
  });
};

const isNewCategoryNameValidCategoryName = (newCategoryName) => {
  return newCategoryName.trim() !== '';
};

const updateErrorMessage = (error) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      errorMessageCategoryNameWidget: error.message,
    },
  });
};

const updateErrorMessageInvalidCategoryName = () => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      errorMessageCategoryNameWidget: 'Invalid category name',
    },
  });
};

// if (current.matches('renaming')) {
//   return (
//     <CategoryListItemRenamingContainer
//       onChangeInputText={(inputText) => send('CHANGE_INPUT_TEXT', { inputText })}
//       onClickCheckmark={() => send('CLICK_CHECKMARK')}
//     />
//   );
// }

// onClickRename={(category) => send('CLICK_RENAME', { inputText: category.name })}

const machineWithConfig = machine.withConfig({
  services: {
    attemptToRenameCategory: (_, event) =>
      attemptToRenameCategory(event.category, event.newCategoryName),
  },
  actions: {
    resetNewCategoryNameToCategoryName: (_, __) => resetNewCategoryNameToCategoryName(),
    updateInputText: (_, event) => updateNewCategoryName(event.inputText),
    updateErrorMessage: (_, event) => updateErrorMessage(event.data),
    updateErrorMessageInvalidCategoryName: (_, __) => updateErrorMessageInvalidCategoryName(),
  },
  guards: {
    isNewCategoryNameValidCategoryName: (_, event) =>
      isNewCategoryNameValidCategoryName(event.newCategoryName),
  },
});

// TODO: Add `onClickRenameButton` as action

const CategoryRenameModalWidget = ({ isOpen, onClose, refetchCategoryData }) => {
  const [current, send] = useMachine(machineWithConfig, {
    actions: {
      refetchCategoryData: (_, __) => refetchCategoryData(),
    },
  });
  return (
    <RenameModal
      shouldShowErrorMessage={current.matches('idle.failure')}
      isOpen={isOpen}
      onClose={onClose}
      onClickRenameButton={(category, newCategoryName) =>
        send('CLICK_RENAME_CATEGORY', {
          category: category,
          newCategoryName: newCategoryName,
        })
      }
      onChangeInputText={(inputText) => send('CHANGE_INPUT_TEXT', { inputText })}
    />
  );
};

export default CategoryRenameModalWidget;
