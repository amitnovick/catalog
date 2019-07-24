//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'config-file',
  initial: 'fetchingAppDataPath',
  states: {
    fetchingAppDataPath: {
      onEntry: ['sendEventToMainProcess'],
      on: {
        RECEIVE_APP_DATA_PATH: 'attemptingToReadConfigFile',
      },
    },
    attemptingToReadConfigFile: {
      invoke: {
        src: 'attemptToReadConfigFile',
        onDone: {
          target: '#config-file.finished',
          actions: 'updateInstancesPaths',
        },
        onError: 'writingDefaultConfigFile',
      },
    },
    writingDefaultConfigFile: {
      invoke: {
        src: 'writeDefaultConfigFile',
        onDone: {
          target: '#config-file.finished',
          actions: 'updateInstancesPaths',
        },
        onError: {
          target: '#config-file.couldntWriteToConfigFileError',
          actions: 'updateErrorMessage',
        },
      },
    },
    finished: {
      type: 'final',
    },
    couldntWriteToConfigFileError: {
      type: 'final',
    },
  },
});

export default machine;
