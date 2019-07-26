//@ts-check
import { Machine } from 'xstate';

const idleStates = {
  initial: 'idle',
  states: {
    idle: {},
    success: {},
    failure: {},
    broadCategoriesModal: {
      on: {
        CLICK_ACCEPT_BROAD_CATEGORIES_MODAL: '#file-screen.loading.attemptingToCreateRelationship',
        CLOSE_BROAD_CATEGORIES_MODAL_REJECT: 'idle',
      },
    },
    fileCategoryActionsModal: {
      on: {
        CLOSE_FILE_CATEGORY_ACTIONS_MODAL: 'idle',
        CLICK_REMOVE_CATEGORY_ACTIONS_MODAL: '#file-screen.loading.removingCategoryOfFile',
      },
    },
  },
};

const machine = Machine({
  id: 'file-screen',
  initial: 'loading',
  context: {
    fileId: null,
  },
  states: {
    idle: {
      ...idleStates,
      on: {
        CHECK_BROAD_CATEGORIES: {
          target: 'loading.checkingExistenceBroaderCategories',
          actions: 'updateChosenSearchResultCategoryId',
        },
        OPEN_FILE_CATEGORY_ACTIONS_MODAL: 'idle.fileCategoryActionsModal',
        CLICK_DELETE_FILE: 'loading.deletingFile',
        CLICK_RENAME_FILE: 'loading.attemptingToRenameFile',
        INPUT_SEARCH_QUERY_CHANGED: {
          target: 'loading.fetchingSearchResultCategories',
          actions: 'updateInputSearchQuery',
        },
      },
    },
    loading: {
      initial: 'fetchingFileData',
      states: {
        fetchingFileData: {
          invoke: {
            src: 'fetchFileData',
            onDone: '#file-screen.idle.idle',
            onError: '#file-screen.failedFetching',
          },
        },
        fetchingSearchResultCategories: {
          invoke: {
            src: 'fetchSearchResultCategories',
            onDone: {
              target: '#file-screen.idle.idle',
              actions: 'updateSearchResultCategories',
            },
            onError: '#file-screen.idle.failure',
          },
        },
        attemptingToCreateRelationship: {
          invoke: {
            src: 'attemptCreatingRelationship',
            onDone: 'fetchingFileData',
            onError: '#file-screen.idle.failure',
          },
        },
        checkingExistenceBroaderCategories: {
          invoke: {
            src: 'checkExistenceBroadCategories',
            onDone: '#file-screen.idle.broadCategoriesModal',
            onError: 'attemptingToCreateRelationship',
          },
        },
        removingCategoryOfFile: {
          invoke: {
            src: 'removeCategoryOfFile',
            onDone: 'fetchingFileData',
            onError: '#file-screen.idle.failure',
          },
        },
        attemptingToRenameFile: {
          invoke: {
            src: 'attemptToRenameFile',
            onDone: 'fetchingFileData',
            onError: '#file-screen.idle.failure',
          },
        },
        deletingFile: {
          invoke: {
            src: 'deleteFile',
            onDone: '#file-screen.deletedFile',
            onError: '#file-screen.idle.failure',
          },
        },
      },
    },
    failedFetching: {
      type: 'final',
    },
    deletedFile: {
      type: 'final',
    },
  },
});

export default machine;
