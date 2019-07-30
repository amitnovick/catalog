//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'category-rename-modal-widget',
  initial: 'idle',
  states: {
    idle: {
      initial: 'idle',
      states: {
        idle: {},
        failure: {},
        success: {},
      },
      on: {
        CLICK_RENAME_CATEGORY: [
          {
            target: 'attemptingToRenameCategory',
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
    attemptingToRenameCategory: {
      invoke: {
        src: 'attemptToRenameCategory',
        onDone: {
          target: 'idle.success',
          actions: 'refetchCategoryData',
        },
        onError: {
          target: 'idle.failure',
          actions: ['updateErrorMessage', 'resetNewCategoryNameToCategoryName'],
        },
      },
    },
  },
});

export default machine;
