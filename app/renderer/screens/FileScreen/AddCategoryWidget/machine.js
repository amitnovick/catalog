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
        highlightNarrowerCategories: {},
      },
      on: {
        INPUT_SEARCH_QUERY_CHANGED: {
          target: 'fetchingSearchResultCategories',
          actions: 'updateInputSearchQuery',
        },
        CHOOSE_CATEGORY_TO_ASSIGN: {
          target: 'fetchingNarrowerCategoriesOfFile',
          actions: 'updateChosenSearchResultCategory',
        },
      },
    },
    broadCategoriesModal: {
      on: {
        CLICK_ACCEPT_BROAD_CATEGORIES_MODAL: 'replacingBroaderCategoriesWithNarrowerCategoryInDb',
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
    fetchingBroaderCategoriesOfFile: {
      invoke: {
        src: 'fetchBroaderCategoriesOfFile',
        onDone: [
          {
            target: 'attemptingToAddCategogoryToDb',
            cond: 'areBroaderCategoriesOfFileEmpty',
          },
          {
            target: 'broadCategoriesModal',
            actions: 'updateBroaderFileCategories',
          },
        ],
        onError: 'fetchingNarrowerCategoriesOfFile',
      },
    },
    fetchingNarrowerCategoriesOfFile: {
      invoke: {
        src: 'fetchNarrowerCategoriesOfFile',
        onDone: [
          {
            target: 'fetchingBroaderCategoriesOfFile',
            cond: 'areNarrowerCategoriesOfFileEmpty',
          },
          {
            target: '#add-category.idle.highlightNarrowerCategories',
            actions: [
              'updateNarrowerCategoriesOfFile',
              'updateNarrowerCategoriesOfFileExistErrorMessage',
            ],
          },
        ],
        onError: {
          target: '#add-category.idle.failure',
          actions: 'updateNarrowerCategoriesOfFileExistErrorMessage',
        },
      },
    },
    attemptingToAddCategogoryToDb: {
      invoke: {
        src: 'attemptToAddCategoryToDb',
        onDone: {
          target: 'idle',
          actions: ['addCategoryToCategoriesState', 'resetInputSearchQuery'],
        },
        onError: 'idle.failure',
      },
    },
    // highlightBroaderCategories: { //TODO: Add this later instead of Categories Action Modal
    //   on: {
    //     CONFIRM_REMOVE_BROADER_CATEGORIES: 'replacingBroaderCategoriesWithNarrowerCategoryInDb',
    //     REJECT_REMOVE_BROADER_CATEGORIES: 'idle'
    //   }
    // },
    replacingBroaderCategoriesWithNarrowerCategoryInDb: {
      invoke: {
        src: 'replaceBroaderCategoriesWithNarrowerCategoryInDb',
        onDone: {
          target: 'idle',
          actions: ['replaceBroaderCategoriesWithNarrowerCategoryInState', 'resetInputSearchQuery'],
        },
        onError: 'idle.failure',
      },
    },
  },
});

export default machine;
