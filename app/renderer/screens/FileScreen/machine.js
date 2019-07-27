//@ts-check
import { Machine } from 'xstate';

const idleStates = {
  initial: 'idle',
  states: {
    idle: {},
    success: {},
    failure: {},
  },
};

const machine = Machine({
  id: 'file-screen',
  initial: 'loading',
  context: {
    fileId: null,
  },
  states: {
    idle: {
      ...idleStates,
      on: {
        CLICK_DELETE_FILE: 'loading.deletingFile',
        CLICK_RENAME_FILE: 'loading.attemptingToRenameFile',
        REFETCH_FILE_DATA: 'loading.fetchingFileData',
      },
    },
    loading: {
      initial: 'fetchingFileData',
      states: {
        fetchingFileData: {
          invoke: {
            src: 'fetchFileData',
            onDone: '#file-screen.idle.idle',
            onError: '#file-screen.failedFetching',
          },
        },
        attemptingToRenameFile: {
          invoke: {
            src: 'attemptToRenameFile',
            onDone: 'fetchingFileData',
            onError: '#file-screen.idle.failure',
          },
        },
        deletingFile: {
          invoke: {
            src: 'deleteFile',
            onDone: '#file-screen.deletedFile',
            onError: '#file-screen.idle.failure',
          },
        },
      },
    },
    failedFetching: {
      type: 'final',
    },
    deletedFile: {
      type: 'final',
    },
  },
});

export default machine;
