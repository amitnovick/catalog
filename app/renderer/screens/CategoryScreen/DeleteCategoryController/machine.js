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
            onDone: 'checkingSubcategoriesEmpty',
            onError: '#delete-category-modal.failure'
          }
        },
        checkingSubcategoriesEmpty: {
          invoke: {
            src: 'checkSubcategoriesEmpty',
            onDone: 'fetchingCategorizedFiles',
            onError: '#delete-category-modal.idle.subcategories'
          }
        },
        fetchingCategorizedFiles: {
          invoke: {
            src: 'fetchCategorizedFiles',
            onDone: 'checkingCategorizedFilesEmpty',
            onError: '#delete-category-modal.failure'
          }
        },
        checkingCategorizedFilesEmpty: {
          invoke: {
            src: 'checkCategorizedFilesEmpty',
            onDone: '#delete-category-modal.idle.confirmation',
            onError: '#delete-category-modal.idle.categorized_files'
          }
        }
      }
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
                CLICK_CONFIRM_DELETE: 'deletingCategory'
              }
            },
            deletingCategory: {
              invoke: {
                src: 'deleteCategory',
                onDone: {
                  actions: 'closeModal'
                },
                onError: 'failure'
              }
            },
            failure: {}
          }
        }
      }
    },
    failure: {}
  }
});

export default machine;
