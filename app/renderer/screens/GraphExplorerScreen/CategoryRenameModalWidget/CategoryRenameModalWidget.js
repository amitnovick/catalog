import React from 'react';
import { useMachine } from '@xstate/react';

import machine from './machine';
import RenameModal from './components/RenameModal';
import queryRenameCategory from '../query-functions/queryRenameCategory';
import { assign } from 'xstate';
import ReactContext from './ReactContext';

const attemptToRenameCategory = (category, inputText) => {
  return queryRenameCategory(category.id, inputText);
};

const isNewCategoryNameValidCategoryName = (inputText) => {
  return inputText.trim() !== '';
};

const machineWithConfig = machine.withConfig({
  services: {
    attemptToRenameCategory: (context, _) =>
      attemptToRenameCategory(context.category, context.inputText),
  },
  actions: {
    updateInputText: assign({ inputText: (_, event) => event.inputText }),
    updateErrorMessage: assign({ errorMessage: (_, event) => event.data.message }),
    updateErrorMessageInvalidCategoryName: assign({
      errorMessage: (_, __) => 'Invalid category name',
    }),
  },
  guards: {
    isNewCategoryNameValidCategoryName: (context, _) =>
      isNewCategoryNameValidCategoryName(context.inputText),
  },
});

const CategoryRenameModalWidget = ({ isOpen, onClose, refetchCategoryData, category }) => {
  const [current, send, service] = useMachine(
    machineWithConfig.withContext({
      category: category,
      inputText: category.name,
    }),
    {
      actions: {
        refetchCategoryData: (_, __) => refetchCategoryData(),
      },
    },
  );
  return (
    <ReactContext.Provider value={service}>
      <RenameModal
        shouldShowErrorMessage={current.matches('idle.failure')}
        isOpen={isOpen}
        onClose={onClose}
        onClickRenameButton={() => send('CLICK_RENAME_CATEGORY')}
        onChangeInputText={(inputText) => send('CHANGE_INPUT_TEXT', { inputText })}
      />
    </ReactContext.Provider>
  );
};

export default CategoryRenameModalWidget;
