//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'search-screen',
  context: {
    searchResultFsResources: [],
    chosenAncestorCategory: null,
    inputFsResourceNameText: '',
    selectedFsResourceRow: null,
    hasSearchedAtLeastOnce: false,
    errorMessage: null,
  },
  type: 'parallel',
  states: {
    processing: {
      id: 'processing',
      initial: 'idle',
      states: {
        idle: {},
        failure: {},
        fetchingSearchResultsBothFilters: {
          invoke: {
            src: 'fetchSearchResultsBothFilters',
            onDone: {
              target: 'idle',
              actions: 'updateSearchResultFsResources',
            },
            onError: {
              target: 'failure',
              actions: 'updateErrorMessage',
            },
          },
        },
        fetchingSearchResultsOnlyByNameFilter: {
          invoke: {
            src: 'fetchSearchResultsOnlyByNameFilter',
            onDone: {
              target: 'idle',
              actions: 'updateSearchResultFsResources',
            },
            onError: {
              target: 'failure',
              actions: 'updateErrorMessage',
            },
          },
        },
        fetchingSearchResultsOnlyByAncestorCategoryFilter: {
          invoke: {
            src: 'fetchSearchResultsOnlyByAncestorCategoryFilter',
            onDone: {
              target: 'idle',
              actions: 'updateSearchResultFsResources',
            },
            onError: {
              target: 'failure',
              actions: 'updateErrorMessage',
            },
          },
        },
      },
      on: {
        FETCH_DATA: [
          {
            cond: (_, __, meta) =>
              meta.state.matches('filtering.filterByName.enabled') &&
              meta.state.matches('filtering.filterByAncestorCategory.enabled'),
            actions: 'updateHasSearchedAtLeastOnce',
            target: '#processing.fetchingSearchResultsBothFilters',
          },
          {
            in: 'filtering.filterByName.enabled',
            actions: 'updateHasSearchedAtLeastOnce',
            target: '#processing.fetchingSearchResultsOnlyByNameFilter',
          },
          {
            in: 'filtering.filterByAncestorCategory.enabled',
            actions: 'updateHasSearchedAtLeastOnce',
            target: '#processing.fetchingSearchResultsOnlyByAncestorCategoryFilter',
          },
        ],
      },
    },
    filtering: {
      type: 'parallel',
      states: {
        filterByName: {
          initial: 'enabled',
          states: {
            enabled: {
              on: {
                TOGGLE_FILTER_BY_NAME: 'disabled',
                CHANGED_TEXT: {
                  actions: 'updateInputFsResourceNameText',
                },
              },
            },
            disabled: {
              on: {
                TOGGLE_FILTER_BY_NAME: 'enabled',
              },
            },
          },
        },
        filterByAncestorCategory: {
          id: 'filter-by-ancestor-category',
          initial: 'disabled',
          states: {
            enabled: {
              on: {
                CHOOSE_ANOTHER_CATEGORY: 'choosing',
              },
            },
            disabled: {
              on: {
                OPENED_CATEGORY_ACCORDION: 'choosing',
              },
            },
            choosing: {
              on: {
                CHOSE_CATEGORY: {
                  actions: 'updateChosenAncestorCategory',
                  target: 'enabled',
                },
              },
            },
          },
          on: {
            CLOSED_CATEGORY_ACCORDION: '#filter-by-ancestor-category.disabled',
          },
        },
      },
    },
  },
  on: {
    SELECT_FILE_ROW: {
      actions: 'updateSelectedFsResourceRow',
    },
  },
});

export default machine;
