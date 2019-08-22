//@ts-check
import { Machine } from 'xstate';

const idleStates = {
  initial: 'idle',
  states: {
    idle: {},
    success: {},
    failure: {
      entry: 'notifyErrorMessage',
      type: 'final',
    },
  },
};

const machine = Machine({
  id: 'file-screen',
  initial: 'loading',
  context: {
    fsResourceId: null,
    fsResource: null,
    categories: null,
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
            src: 'fetchFsResourceData',
            onDone: {
              target: '#file-screen.idle.idle',
              actions: ['updateCategories', 'updateFsResource'],
            },
            onError: '#file-screen.idle.failure',
          },
        },
        deletingFile: {
          invoke: {
            src: 'deleteFsResource',
            onDone: '#file-screen.deletedFile',
            onError: '#file-screen.idle.failure',
          },
        },
      },
    },
    deletedFile: {
      type: 'final',
    },
  },
});

export default machine;
