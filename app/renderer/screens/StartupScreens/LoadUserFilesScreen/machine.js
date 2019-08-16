//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'load-user-files',
  initial: 'checkingUserFilesDirExists',
  states: {
    checkingUserFilesDirExists: {
      invoke: {
        src: 'checkUserFilesDirExists',
        onDone: 'writingUserFilesDirIfNotExists',
        onError: {
          target: 'failure',
          actions: 'updateErrorMessage',
        },
      },
    },
    writingUserFilesDirIfNotExists: {
      invoke: {
        src: 'writeUserFilesDirIfNotExists',
        onDone: 'writingFilesSubdirIfNotExists',
        onError: {
          target: 'failure',
          actions: 'updateErrorMessage',
        },
      },
    },
    writingFilesSubdirIfNotExists: {
      invoke: {
        src: 'writeFilesSubdirIfNotExists',
        onDone: 'writingSqliteFileAndInitializingIfNotExists',
        onError: {
          target: 'failure',
          actions: 'updateErrorMessage',
        },
      },
    },
    writingSqliteFileAndInitializingIfNotExists: {
      invoke: {
        src: 'writeSqliteFileAndInitializingIfNotExists',
        onDone: {
          actions: 'navigateToHomeScreen',
        },
        onError: {
          target: 'failure',
          actions: 'updateErrorMessage',
        },
      },
    },
    failure: {},
  },
});

export default machine;
