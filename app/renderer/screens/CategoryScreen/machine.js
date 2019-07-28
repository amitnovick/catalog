//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'category-screen',
  initial: 'fetchingCategoryData',
  context: {
    categoryId: null, // Meaningless default value
  },
  states: {
    fetchingCategoryData: {
      invoke: {
        src: 'fetchCategoryData',
        onDone: {
          target: 'idle.success',
          actions: ['updateCategoryData', 'updateNewCategoryName'],
        },
        onError: '#category-screen.fetchingFailed',
      },
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
            DELETE_CATEGORY_MODAL_CONFIRM_DELETE: '#category-screen.deletedCategory',
          },
        },
      },
      on: {
        CLICK_DELETE_CATEGORY: '#category-screen.idle.deleteCategoryStepsModal',
        REFETCH_CATEGORY_DATA: 'fetchingCategoryData',
      },
    },
    fetchingFailed: {
      type: 'final',
    },
    deletedCategory: {
      type: 'final',
    },
  },
});

export default machine;
