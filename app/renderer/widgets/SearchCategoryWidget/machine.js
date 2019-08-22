//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'search-category',
  initial: 'idle',
  context: {
    inputSearchQuery: '',
    searchResultCategories: [],
    errorMessage: null,
  },
  states: {
    idle: {
      on: {
        CHANGE_INPUT_SEARCH_QUERY: {
          target: 'fetchingSearchResultCategories',
          actions: 'updateInputSearchQuery',
        },
        CHOOSE_SEARCH_RESULT_CATEGORY: {
          actions: 'onFinish',
        },
      },
    },
    fetchingSearchResultCategories: {
      invoke: {
        src: 'fetchSearchResultCategories',
        onDone: {
          target: 'idle',
          actions: 'updateSearchResultCategories',
        },
        onError: {
          target: 'failure',
          actions: 'updateErrorMessage',
        },
      },
    },
    failure: {},
  },
});

export default machine;
