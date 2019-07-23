//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'graph-machine',
  context: {
    initialCategoryId: undefined
  },
  initial: 'loading',
  states: {
    loading: {
      invoke: {
        src: 'fetchInitialData',
        onDone: 'idle',
        onError: 'failure'
      }
    },
    idle: {},
    failure: {}
  }
});

export default machine;
