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
        highlightExistingCategory: {},
      },
      on: {
        INPUT_SEARCH_QUERY_CHANGED: {
          target: 'fetchingSearchResultCategories',
          actions: 'updateInputSearchQuery',
        },
        CHOOSE_CATEGORY_TO_ASSIGN: [
          {
            target: 'fetchingNarrowerCategoriesOfFile',
            cond: 'categoryIsntAlreadyAssigned',
            actions: 'updateChosenSearchResultCategory',
          },
          {
            target: 'idle.highlightExistingCategory',
          },
        ],
        CLICK_CREATE_NEW_CATEGORY: {
          target: 'creatingNewCategoryAndAssigningFile',
          cond: 'isCategoryNameWhitespace',
        },
      },
    },
    broadCategoriesModal: {
      on: {
        CLICK_ACCEPT_BROAD_CATEGORIES_MODAL: 'replacingBroaderCategoriesWithNarrowerCategoryInDb',
        CLOSE_BROAD_CATEGORIES_MODAL_REJECT: 'idle',
      },
    },
    creatingNewCategoryAndAssigningFile: {
      invoke: {
        src: 'createNewCategory',
        onDone: {
          target: 'fetchingNarrowerCategoriesOfFile',
          actions: 'updateSyntheticallyChosenSearchResultCategory',
        },
        onError: {
          target: 'fetchingExistingCategoryAndAssign',
        },
      },
    },
    fetchingExistingCategoryAndAssign: {
      invoke: {
        src: 'fetchExistingCategoryAndAssign',
        onDone: {
          target: 'fetchingNarrowerCategoriesOfFile',
          actions: 'updateSyntheticallyChosenSearchResultCategory',
        },
        onError: 'idle.failure',
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
            target: 'attemptingToAddChosenSearchResultCategory',
            cond: 'areBroaderCategoriesOfFileEmpty',
          },
          {
            target: 'broadCategoriesModal',
            actions: 'updateBroaderFileCategories',
          },
        ],
        onError: 'idle.failure',
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
            actions: ['updateNarrowerCategoriesOfFile'],
          },
        ],
        onError: {
          target: '#add-category.idle.failure',
          actions: 'updateErrorMessage',
        },
      },
    },
    attemptingToAddChosenSearchResultCategory: {
      invoke: {
        src: 'attemptToAddChosenSearchResultCategory',
        onDone: {
          target: 'idle',
          actions: ['refetchFileData', 'resetInputSearchQuery'],
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
          actions: ['refetchFileData', 'resetInputSearchQuery'],
        },
        onError: 'idle.failure',
      },
    },
  },
});

export default machine;
