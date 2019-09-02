//@ts-check
import { Machine, send } from 'xstate';

const machine = Machine({
  id: 'explorer-screen',
  context: {
    initialCategoryId: null,
    categoriesInPath: [],
    fsResources: [],
    childCategories: [],
    categoryRenamingModalCategory: null,
    categoryRenamingModalChosenNewCategoryName: null,
    categoryMoveToModalCategory: null,
    categoryDeletionModalCategory: null,
    selectedCategoryRow: null,
    selectedFsResourceRow: null,
    errorMessage: null,
    newCategoryName: null,
  },
  type: 'parallel',
  states: {
    processes: {
      id: 'processes',
      initial: 'fetchingData',
      states: {
        idle: {
          on: {
            CLICK_ADD_CATEGORY_BUTTON: {
              target: 'categoryAdditionModal',
            },
            CLICK_CATEGORY_RENAME_BUTTON: {
              target: 'categoryRenamingModal',
              in: '#explorer-screen.categoryRowSelection.selectedRow',
              actions: 'updateCategoryRenamingModalCategory',
            },
            CLICK_CATEGORY_MOVE_TO__BUTTON: {
              target: 'categoryMoveToModal',
              in: '#explorer-screen.categoryRowSelection.selectedRow',
              actions: 'updateCategoryMoveToModalCategory',
            },
            CLICK_CATEGORY_DELETE_BUTTON: {
              target: 'categoryDeletionModal',
              in: '#explorer-screen.categoryRowSelection.selectedRow',
              actions: 'updateCategoryDeletionModalCategory',
            },
            SELECTED_FS_RESOURCE_ROW: {
              actions: 'updateSelectedFsResourceRow',
            },
          },
        },
        fetchingData: {
          invoke: {
            src: 'fetchData',
            onDone: {
              target: 'idle',
              actions: 'updateState',
            },
            onError: {
              target: 'failure',
              actions: 'updateErrorMessage',
            },
          },
        },
        fetchingNewCategoryDataAndAssigningSelectedCategoryRow: {
          invoke: {
            src: 'fetchData',
            onDone: {
              target: 'idle',
              actions: [
                'updateState',
                send((_, event) => ({
                  type: 'SELECTED_NEWLY_CREATED_CATEGORY_ROW',
                  data: event.data,
                })),
              ],
            },
            onError: {
              target: 'failure',
              actions: 'updateErrorMessage',
            },
          },
        },
        fetchingRenamedCategoryDataAndAssigningSelectedCategoryRow: {
          invoke: {
            src: 'fetchData',
            onDone: {
              target: '#processes.idle',
              actions: ['updateState', 'assignSelectedCategoryRowById'],
            },
            onError: {
              target: '#processes.failure',
              actions: 'updateErrorMessage',
            },
          },
        },
        failure: {},
        categoryRenamingModal: {
          on: {
            CATEGORY_RENAMING_MODAL_CANCEL: 'idle',
            CATEGORY_RENAMING_MODAL_SUBMIT:
              'fetchingRenamedCategoryDataAndAssigningSelectedCategoryRow',
          },
        },
        categoryDeletionModal: {
          on: {
            CATEGORY_DELETION_MODAL_CANCEL: 'idle',
            CATEGORY_DELETION_MODAL_SUBMIT: 'fetchingData',
          },
        },
        categoryAdditionModal: {
          on: {
            CATEGORY_ADDITION_MODAL_CANCEL: 'idle',
            CATEGORY_ADDITION_MODAL_SUBMIT: {
              target: 'fetchingNewCategoryDataAndAssigningSelectedCategoryRow',
              actions: 'updateNewCategoryName',
            },
          },
        },
        categoryMoveToModal: {
          on: {
            CATEGORY_MOVE_TO_MODAL_CANCEL: 'idle',
            CATEGORY_MOVE_TO_MODAL_SUBMIT: 'fetchingData',
          },
        },
      },
    },
    categoryRowSelection: {
      id: 'category-row-selection',
      initial: 'noSelectedRow',
      states: {
        noSelectedRow: {},
        selectedRow: {},
      },
      on: {
        SELECTED_CATEGORY_ROW: {
          target: '#category-row-selection.selectedRow',
          in: 'processes.idle',
          actions: 'updateSelectedCategoryRow',
        },
        SELECTED_NEWLY_CREATED_CATEGORY_ROW: {
          target: 'categoryRowSelection.selectedRow',
          actions: 'assignSelectedCategoryRowByName',
        },
        CATEGORY_DELETION_MODAL_SUBMIT: [
          {
            target: 'categoryRowSelection.noSelectedRow',
            cond: 'checkIsSelectedRowToBeDeleted',
            actions: 'clearSelectedCategoryRow',
          },
          {
            actions: 'clearSelectedCategoryRow',
          },
        ],
        CATEGORY_MOVE_TO_MODAL_SUBMIT: {
          target: 'categoryRowSelection.noSelectedRow',
          actions: 'clearSelectedCategoryRow',
        },
      },
    },
  },
});

export default machine;
