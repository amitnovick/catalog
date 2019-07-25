import { Machine } from 'xstate';

const machine = Machine({
  id: 'instance-list-item',
  initial: 'idle',
  states: {
    idle: {
      on: {
        CLICK_REMOVE_INSTANCE: 'writingToConfigFile',
      },
    },
    writingToConfigFile: {
      invoke: {
        src: 'writeToConfigFile',
        onDone: {
          actions: 'updateInstancesPaths',
        },
        onError: {
          target: 'failure',
        },
      },
    },
    failure: {},
  },
});

export default machine;
