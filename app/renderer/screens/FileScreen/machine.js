//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'file-screen',
  initial: 'loading',
  context: {
    fsResourceId: null,
    fsResource: null,
    categories: null,
    errorMessage: null,
  },
  states: {
    idle: {
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
              target: '#file-screen.idle',
              actions: ['updateCategories', 'updateFsResource'],
            },
            onError: {
              target: '#file-screen.failure',
              actions: 'updateErrorMessage',
            },
          },
        },
        deletingFile: {
          invoke: {
            src: 'deleteFsResource',
            onDone: '#file-screen.deletedFile',
            onError: {
              target: '#file-screen.failure',
              actions: 'updateErrorMessage',
            },
          },
        },
      },
    },
    failure: {
      type: 'final',
    },
    deletedFile: {
      type: 'final',
    },
  },
});

export default machine;
