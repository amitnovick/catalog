//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'load-user-files',
  initial: 'writingUserFilesDirIfNotExists',
  states: {
    writingUserFilesDirIfNotExists: {
      invoke: {
        src: 'writeUserFilesDirIfNotExists',
        onDone: 'writingFilesSubdirIfNotExists',
        onError: 'failure'
      }
    },
    writingFilesSubdirIfNotExists: {
      invoke: {
        src: 'writeFilesSubdirIfNotExists',
        onDone: 'writingSqliteFileAndInitializingIfNotExists',
        onError: 'failure'
      }
    },
    writingSqliteFileAndInitializingIfNotExists: {
      invoke: {
        src: 'writeSqliteFileAndInitializingIfNotExists',
        onDone: 'finished',
        onError: 'failure'
      }
    },
    finished: {},
    failure: {}
  }
});

export default machine;
