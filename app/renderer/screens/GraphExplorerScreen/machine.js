//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'graph-machine',
  context: {
    initialCategoryId: null,
  },
  initial: 'loading',
  states: {
    loading: {
      invoke: {
        src: 'fetchInitialData',
        onDone: {
          target: 'idle',
          actions: 'updateState',
        },
        onError: 'failure',
      },
    },
    idle: {},
    failure: {},
  },
});

export default machine;
