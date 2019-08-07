import React from 'react';
import { useMachine } from '@xstate/react';

import machine from './machine';
import AdditionModal from './components/AdditionModal';
import { assign } from 'xstate';
import ReactContext from './ReactContext';
import queryAddNewSubcategory from '../../../db/queries/queryAddNewSubcategory';

const attemptToCreateCategory = (parentCategoryId, newCategoryName) => {
  return queryAddNewSubcategory(parentCategoryId, newCategoryName);
};

const isNewCategoryNameValidCategoryName = (inputText) => {
  return inputText.trim() !== '';
};

const machineWithConfig = machine.withConfig({
  services: {
    attemptToCreateCategory: (context, _) =>
      attemptToCreateCategory(context.parentCategoryId, context.inputText),
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

const CategoryAdditionModalWidget = ({ onClose, refetchCategoryData, parentCategoryId }) => {
  const [current, send, service] = useMachine(
    machineWithConfig.withContext({
      parentCategoryId: parentCategoryId,
      inputText: '',
      errorMessage: '',
    }),
    {
      actions: {
        refetchCategoryData: (_, __) => refetchCategoryData(),
      },
    },
  );
  return (
    <ReactContext.Provider value={service}>
      <AdditionModal
        shouldShowErrorMessage={current.matches('idle.failure')}
        onClose={onClose}
        onClickSubmitButton={() => send('CLICK_SUBMIT_BUTTON')}
        onChangeInputText={(inputText) => send('CHANGE_INPUT_TEXT', { inputText })}
      />
    </ReactContext.Provider>
  );
};

export default CategoryAdditionModalWidget;
