//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'category-screen',
  initial: 'loading',
  context: {
    categoryId: null // Meaningless default value
  },
  states: {
    loading: {
      initial: 'fetchingCategoryData',
      states: {
        fetchingCategoryData: {
          invoke: {
            src: 'fetchCategoryData',
            onDone: '#category-screen.idle',
            onError: '#category-screen.fetchingFailed'
          }
        },
        attemptingRenameCategory: {
          invoke: {
            src: 'attemptRenameCategory',
            onDone: 'fetchingCategoryData',
            onError: '#category-screen.idle.failure'
          }
        }
      }
    },
    idle: {
      initial: 'idle',
      states: {
        idle: {},
        success: {},
        failure: {},
        deleteCategoryStepsModal: {
          on: {
            CLICK_CLOSE_MODAL: '#category-screen.idle',
            DELETE_CATEGORY_MODAL_CONFIRM_DELETE:
              '#category-screen.deletedCategory'
          }
        }
      },
      on: {
        CLICK_RENAME_CATEGORY: 'loading.attemptingRenameCategory',
        CLICK_DELETE_CATEGORY: '#category-screen.idle.deleteCategoryStepsModal'
      }
    },
    fetchingFailed: {
      type: 'final'
    },
    deletedCategory: {
      type: 'final'
    }
  }
});

export default machine;
