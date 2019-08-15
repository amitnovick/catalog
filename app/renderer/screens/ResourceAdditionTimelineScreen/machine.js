//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'resource-addition-timeline-screen',
  context: {
    pageNumber: null, // Default value
    paginatedResources: [], // Default value
    countOfFiles: null, // Default value
    errorMessage: '',
    selectedResource: null,
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
    success: {
      on: {
        SELECT_RESOURCE_ROW: {
          actions: 'updateSelectedResource',
        },
      },
    },
    failure: {},
  },
});

export default machine;
