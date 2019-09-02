//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'delete-category-modal',
  initial: 'loading',
  context: {
    subcategories: [],
    categorizedFiles: [],
    category: null,
    errorMessage: null,
  },
  states: {
    loading: {
      initial: 'fetchingSubcategories',
      states: {
        fetchingSubcategories: {
          invoke: {
            src: 'fetchSubcategories',
            onDone: [
              {
                target: 'fetchingCategorizedFiles',
                cond: 'isSubcategoriesEmpty',
              },
              {
                actions: 'updateSubcategories',
                target: '#delete-category-modal.idle.subcategories',
              },
            ],
            onError: {
              target: '#delete-category-modal.failure',
              actions: 'updateErrorMessage',
            },
          },
        },
        fetchingCategorizedFiles: {
          invoke: {
            src: 'fetchCategorizedFiles',
            onDone: [
              {
                target: '#delete-category-modal.idle.confirmation',
                cond: 'isCategorizedFilesEmpty',
              },
              {
                target: '#delete-category-modal.idle.categorized_files',
                actions: 'updateCategorizedFiles',
              },
            ],
            onError: {
              target: '#delete-category-modal.failure',
              actions: 'updateErrorMessage',
            },
          },
        },
      },
    },
    idle: {
      states: {
        subcategories: {},
        categorized_files: {},
        confirmation: {
          initial: 'idle',
          states: {
            idle: {
              on: {
                CLICK_CONFIRM_DELETE: 'deletingCategory',
              },
            },
            deletingCategory: {
              invoke: {
                src: 'deleteCategory',
                onDone: {
                  actions: 'closeModal',
                },
                onError: {
                  target: '#delete-category-modal.failure',
                  actions: 'updateErrorMessage',
                },
              },
            },
          },
        },
      },
    },
    failure: {},
  },
});

export default machine;
