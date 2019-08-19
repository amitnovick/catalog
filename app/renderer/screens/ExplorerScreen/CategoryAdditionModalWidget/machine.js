//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'category-addition-modal-widget',
  initial: 'idle',
  context: {
    parentCategoryId: null,
    inputText: '',
    errorMessage: '',
  },
  states: {
    idle: {
      initial: 'idle',
      states: {
        idle: {},
        failure: {},
        success: {},
      },
      on: {
        CLICK_SUBMIT_BUTTON: [
          {
            target: 'attemptingToCreateCategory',
            cond: 'isNewCategoryNameValidCategoryName',
          },
          {
            target: 'idle.failure',
            actions: 'updateErrorMessageInvalidCategoryName',
          },
        ],
        CHANGE_INPUT_TEXT: {
          target: 'idle.idle',
          actions: 'updateInputText',
        },
      },
    },
    attemptingToCreateCategory: {
      invoke: {
        src: 'attemptToCreateCategory',
        onDone: {
          target: 'idle.success',
          actions: 'refetchCategoryData',
        },
        onError: {
          target: 'idle.failure',
          actions: 'updateErrorMessage',
        },
      },
    },
  },
});

export default machine;
