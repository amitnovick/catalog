//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'graph-machine',
  context: {
    initialCategoryId: null,
  },
  initial: 'idle',
  states: {
    idle: {
      initial: 'loading',
      states: {
        loading: {
          invoke: {
            src: 'fetchInitialData',
            onDone: {
              target: 'idle',
              actions: 'updateState',
            },
            onError: 'failure',
          },
        },
        idle: {
          on: {
            CLICK_CATEGORY_RENAME_BUTTON: {
              target: '#graph-machine.categoryRenamingModal',
              actions: [
                'updateRenameCategoryInputText',
                'updateChosenCategoryRenamingCategoryModal',
              ],
            },
          },
        },
        failure: {},
      },
    },
    categoryRenamingModal: {
      on: {
        CATEGORY_RENAMING_MODAL_CANCEL: 'idle.idle',
        CATEGORY_RENAMING_MODAL_SUBMIT: 'idle.loading',
      },
    },
  },
});

export default machine;
