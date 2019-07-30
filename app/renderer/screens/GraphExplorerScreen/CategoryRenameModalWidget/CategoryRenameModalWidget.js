import React from 'react';
import { useMachine } from '@xstate/react';

import machine from './machine';
import store from '../../../redux/store';
import { RECEIVE_ENTITIES } from '../actionTypes';
import RenameModal from './components/RenameModal';
import queryRenameCategory from '../query-functions/queryRenameCategory';

const getChosenCategoryRenamingCategoryModal = (store) =>
  store && store.graphExplorerScreen
    ? store.graphExplorerScreen.chosenCategoryRenamingCategoryModal
    : null;

const getInputText = (store) =>
  store && store.graphExplorerScreen ? store.graphExplorerScreen.categoryRenameModalInputText : '';

const attemptToRenameCategory = () => {
  const category = getChosenCategoryRenamingCategoryModal(store.getState());
  const inputText = getInputText(store.getState());
  return queryRenameCategory(category.id, inputText);
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

const isNewCategoryNameValidCategoryName = () => {
  const inputText = getInputText(store.getState());
  return inputText.trim() !== '';
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

const CategoryRenameModalWidget = ({ isOpen, onClose, refetchCategoryData }) => {
  const [current, send] = useMachine(machineWithConfig, {
    actions: {
      refetchCategoryData: (_, __) => refetchCategoryData(),
    },
    devTools: true,
  });
  return (
    <RenameModal
      shouldShowErrorMessage={current.matches('idle.failure')}
      isOpen={isOpen}
      onClose={onClose}
      onClickRenameButton={() => send('CLICK_RENAME_CATEGORY')}
      onChangeInputText={(inputText) => send('CHANGE_INPUT_TEXT', { inputText })}
    />
  );
};

export default CategoryRenameModalWidget;
