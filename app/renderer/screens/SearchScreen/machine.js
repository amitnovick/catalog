//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'main',
  initial: 'allFiles',
  states: {
    allFiles: {
      id: 'all-files-tab',
      initial: 'idle',
      states: {
        idle: {
          on: {
            CLICK_SEARCH_BUTTON: 'loading'
          }
        },
        loading: {
          invoke: {
            src: 'fetchAllFiles',
            onDone: '#all-files-tab.idle',
            onError: '#all-files-tab.failure'
          }
        },
        failure: {}
      },
      on: {
        CLICK_FILES_UNDER_CATEGORY_TAB: 'filesUnderCategory'
      }
    },
    filesUnderCategory: {
      id: 'files-under-category-tab',
      initial: 'idle',
      states: {
        idle: {
          on: {
            CLICK_SEARCH_BUTTON: 'loading'
          }
        },
        loading: {
          invoke: {
            src: 'fetchFilesUnderCategory',
            onDone: '#files-under-category-tab.idle',
            onError: '#files-under-category-tab.failure'
          }
        },
        failure: {}
      },
      on: {
        CLICK_ALL_FILES_TAB: 'allFiles'
      }
    }
  }
});

export default machine;
