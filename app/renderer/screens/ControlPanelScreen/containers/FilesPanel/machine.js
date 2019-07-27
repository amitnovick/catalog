import { Machine } from 'xstate';

const idleStates = {
  initial: 'idle',
  states: {
    idle: {},
    success: {},
    failure: {}
  }
};

const machine = Machine({
  id: 'control-panel',
  initial: 'idle',
  states: {
    idle: {
      ...idleStates,
      on: {
        ADD_NEW_FILE: {
          target: 'loading',
          cond: 'isValidFileName'
        }
      }
    },
    loading: {
      invoke: {
        src: 'addNewFile',
        onDone: {
          target: 'idle.success',
          actions: 'openFile'
        },
        onError: 'idle.failure'
      }
    }
  }
});

export default machine;
