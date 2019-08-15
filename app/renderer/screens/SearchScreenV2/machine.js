//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'search-screen',
  context: {
    data: null,
  },
  type: 'parallel',
  states: {
    processing: {
      id: 'processing',
      initial: 'idle',
      states: {
        idle: {},
        fetchingData: {
          invoke: {
            src: 'fetchData',
            onDone: {
              target: 'idle',
              actions: 'updateData',
            },
          },
        },
      },
    },
    filtering: {
      type: 'parallel',
      states: {
        filterByName: {
          initial: 'enabled',
          states: {
            enabled: {},
            disabled: {},
          },
        },
        filterByAncestorCategory: {
          initial: 'disabled',
          states: {
            enabled: {},
            disabled: {},
          },
        },
      },
    },
  },
  on: {
    FETCH_DATA: '#processing.fetchingData',
  },
});

export default machine;
