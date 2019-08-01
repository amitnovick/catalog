//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'explorer-screen',
  context: {
    initialCategoryId: null,
    categoriesInPath: [],
    files: [],
    childCategories: [],
    categoryRenamingModalCategory: null,
    categoryDeletionModalCategory: null,
  },
  initial: 'idle',
  states: {
    idle: {
      id: 'explorer-screen-idle',
      initial: 'fetchingData',
      states: {
        fetchingData: {
          invoke: {
            src: 'fetchData',
            onDone: {
              target: '#explorer-screen-idle.idle',
              actions: 'updateState',
            },
            onError: '#explorer-screen-idle.failure',
          },
        },
        idle: {
          on: {
            CLICK_CATEGORY_RENAME_BUTTON: {
              target: '#explorer-screen.categoryRenamingModal',
              actions: 'updateCategoryRenamingModalCategory',
            },
            CLICK_CATEGORY_DELETE_BUTTON: {
              target: '#explorer-screen.categoryDeletionModal',
              actions: 'updateCategoryDeletionModalCategory',
            },
            CLICK_ADD_CATEGORY_BUTTON: {
              target: '#explorer-screen.categoryAdditionModal',
            },
          },
        },
        failure: {},
      },
    },
    categoryRenamingModal: {
      on: {
        CATEGORY_RENAMING_MODAL_CANCEL: 'idle.idle',
        CATEGORY_RENAMING_MODAL_SUBMIT: 'idle.fetchingData',
      },
    },
    categoryDeletionModal: {
      on: {
        CATEGORY_DELETION_MODAL_CANCEL: 'idle.idle',
        CATEGORY_DELETION_MODAL_SUBMIT: 'idle.fetchingData',
      },
    },
    categoryAdditionModal: {
      on: {
        CATEGORY_ADDITION_MODAL_CANCEL: 'idle.idle',
        CATEGORY_ADDITION_MODAL_SUBMIT: 'idle.fetchingData',
      },
    },
  },
});

export default machine;
