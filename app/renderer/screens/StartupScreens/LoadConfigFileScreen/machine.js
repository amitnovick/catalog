//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'config-file',
  initial: 'attemptingToReadConfigFile',
  states: {
    attemptingToReadConfigFile: {
      invoke: {
        src: 'attemptToReadConfigFile',
        onDone: {
          target: '#config-file.finished',
          actions: ['updateConfigDirectoryPath', 'updateInstancesPaths'],
        },
        onError: {
          target: 'writingDefaultConfigFile',
          actions: 'updateConfigDirectoryPath',
        },
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
