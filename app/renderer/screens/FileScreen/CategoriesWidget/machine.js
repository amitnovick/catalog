//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'categories-widget',
  initial: 'idle',
  states: {
    idle: {
      on: {
        OPEN_FILE_CATEGORY_ACTIONS_MODAL: {
          target: 'fileCategoryActionsModal',
          actions: 'updateCategoryForActionsModal',
        },
      },
    },
    fileCategoryActionsModal: {
      on: {
        CLOSE_FILE_CATEGORY_ACTIONS_MODAL: 'idle',
        CLICK_REMOVE_CATEGORY_ACTIONS_MODAL: 'removingCategoryOfFile',
      },
    },
    removingCategoryOfFile: {
      invoke: {
        src: 'removeCategoryOfFile',
        onDone: {
          target: 'idle',
          actions: 'removeCategoryFromState',
        },
        onError: 'failure',
      },
    },
    failure: {},
  },
});

export default machine;
