//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'resource-addition-timeline-screen',
  context: {
    pageNumber: null, // Default value
    paginatedResources: [], // Default value
    countOfFiles: null, // Default value
    errorMessage: '',
  },
  initial: 'fetchingPaginatedResources',
  states: {
    fetchingPaginatedResources: {
      invoke: {
        src: 'fetchPaginatedResources',
        onDone: {
          target: 'success',
          actions: 'updatePaginatedResources',
        },
        onError: {
          target: 'failure',
          actions: 'updateErrorMessage',
        },
      },
    },
    success: {},
    failure: {},
  },
});

export default machine;
