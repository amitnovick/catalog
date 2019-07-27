//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'add-category',
  initial: 'idle',
  states: {
    idle: {
      initial: 'idle',
      states: {
        idle: {},
        failure: {},
      },
      on: {
        INPUT_SEARCH_QUERY_CHANGED: {
          target: 'fetchingSearchResultCategories',
          actions: 'updateInputSearchQuery',
        },
        CHECK_BROAD_CATEGORIES: {
          target: 'checkingExistenceBroaderCategories',
          actions: 'updateChosenSearchResultCategory',
        },
      },
    },
    broadCategoriesModal: {
      on: {
        CLICK_ACCEPT_BROAD_CATEGORIES_MODAL: 'attemptingToCreateRelationship',
        CLOSE_BROAD_CATEGORIES_MODAL_REJECT: 'idle',
      },
    },
    fetchingSearchResultCategories: {
      invoke: {
        src: 'fetchSearchResultCategories',
        onDone: {
          target: 'idle',
          actions: 'updateSearchResultCategories',
        },
        onError: '#add-category.idle.failure',
      },
    },
    checkingExistenceBroaderCategories: {
      invoke: {
        src: 'checkExistenceBroadCategories',
        onDone: 'broadCategoriesModal',
        onError: 'attemptingToCreateRelationship',
      },
    },
    attemptingToCreateRelationship: {
      invoke: {
        src: 'attemptCreatingRelationship',
        onDone: {
          target: 'idle',
          actions: ['addChosenCategoryToState', 'resetInputSearchQuery'],
        },
        onError: {
          target: '#add-category.idle.failure',
          actions: 'updateErrorMessage',
        },
      },
    },
  },
});

export default machine;
