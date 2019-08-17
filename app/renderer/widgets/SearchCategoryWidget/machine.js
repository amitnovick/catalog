//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'search-category',
  initial: 'idle',
  context: {
    inputSearchQuery: '',
    searchResultCategories: [],
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
        onError: 'failure',
      },
    },
    failure: {},
  },
});

export default machine;
