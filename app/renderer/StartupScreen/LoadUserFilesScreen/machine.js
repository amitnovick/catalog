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
        onError: 'failure',
      },
    },
    writingFilesSubdirIfNotExists: {
      invoke: {
        src: 'writeFilesSubdirIfNotExists',
        onDone: 'writingSqliteFileAndInitializingIfNotExists',
        onError: 'failure',
      },
    },
    writingSqliteFileAndInitializingIfNotExists: {
      invoke: {
        src: 'writeSqliteFileAndInitializingIfNotExists',
        onDone: {
          actions: 'navigateToHomeScreen',
        },
        onError: 'failure',
      },
    },
    failure: {},
  },
});

export default machine;
