import { Machine } from 'xstate';

const machine = Machine({
  id: 'add-new-instance-section',
  initial: 'idle',
  states: {
    idle: {
      on: {
        CLICK_SUBMIT_NEW_INSTANCE: 'writingNewInstanceToConfigFile',
      },
    },
    writingNewInstanceToConfigFile: {
      invoke: {
        src: 'writeNewInstanceToConfigFile',
        onDone: {
          target: 'idle',
          actions: ['updateInstancesPaths', 'resetInputPath'],
        },
        onError: {
          target: 'couldntWriteToFileError',
          actions: 'updateErrorMessage',
        },
      },
    },
    couldntWriteToFileError: {
      on: {
        CLICK_RETRY: 'idle',
      },
    },
  },
});

export default machine;
