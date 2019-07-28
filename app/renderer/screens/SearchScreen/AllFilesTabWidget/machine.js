//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'all-files-tab',
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
        src: 'fetchAllFiles',
        onDone: 'idle',
        onError: 'failure',
      },
    },
    failure: {},
  },
});

export default machine;
