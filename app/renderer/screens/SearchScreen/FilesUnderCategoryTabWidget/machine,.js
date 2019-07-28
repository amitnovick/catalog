//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'files-under-category-tab',
  initial: 'idle',
  states: {
    idle: {
      on: {
        SEARCH_TEXT_CHANGED: {
          target: 'loading',
          actions: 'updateSearchText',
        },
      },
    },
    loading: {
      invoke: {
        src: 'fetchFilesUnderCategory',
        onDone: 'idle',
        onError: 'failure',
      },
    },
    failure: {},
  },
});

export default machine;
