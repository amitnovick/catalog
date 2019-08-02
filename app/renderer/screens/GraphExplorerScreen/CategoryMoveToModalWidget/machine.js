//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'category-move-to-modal',
  initial: 'searching',
  context: {
    childCategory: null,
    chosenParentCategory: null,
    errorMessage: '',
  },
  states: {
    searching: {
      on: {
        CHOOSE_PARENT_CATEGORY: {
          target: 'chosenResult',
          actions: 'updateChosenParentCategory',
        },
      },
    },
    chosenResult: {
      id: 'chosen-result',
      initial: 'idle',
      states: {
        idle: {
          on: {
            CLICK_SUBMIT: 'checkingForParentCategoryValidity',
            CLICK_CLEAR_CHOSEN_CATEGORY: '#category-move-to-modal.searching',
          },
        },
        failure: {
          on: {
            CLICK_CLEAR_CHOSEN_CATEGORY: '#category-move-to-modal.searching',
          },
        },
        checkingForParentCategoryValidity: {
          invoke: {
            src: 'checkIsParentCategoryValid',
            onDone: 'deletingParentCategoryOfFilesWithBothParentAndChild',
            onError: {
              target: '#chosen-result.failure',
              actions: 'updateErrorMessage',
            },
          },
        },
        deletingParentCategoryOfFilesWithBothParentAndChild: {
          invoke: {
            src: 'deleteParentCategoryOfFilesWithBothParentAndChild',
            onDone: 'updatingParentCategoryOfChildCategory',
            onError: {
              target: '#chosen-result.failure',
              actions: 'updateErrorMessage',
            },
          },
        },
        updatingParentCategoryOfChildCategory: {
          invoke: {
            src: 'updateParentCategoryOfChildCategory',
            onDone: {
              actions: 'onFinish',
            },
            onError: {
              target: '#chosen-result.failure',
              actions: 'updateErrorMessage',
            },
          },
        },
      },
    },
  },
  on: {
    CLICK_CANCEL: {
      actions: 'onClose',
    },
  },
});

export default machine;
