//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'delete-category-modal',
  initial: 'loading',
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
            onError: '#delete-category-modal.failure',
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
            onError: '#delete-category-modal.failure',
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
                onError: '#delete-category-modal.failure',
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
