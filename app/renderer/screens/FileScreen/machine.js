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
        REFETCH_FILE_DATA: 'loading.fetchingFileData',
      },
    },
    loading: {
      initial: 'fetchingFileData',
      states: {
        fetchingFileData: {
          invoke: {
            src: 'fetchFileData',
            onDone: {
              target: '#file-screen.idle.idle',
              actions: ['updateCategories', 'updateFile', 'updateNewFileName'],
            },
            onError: '#file-screen.failedFetching',
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
