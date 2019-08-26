//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'categories-widget',
  context: {
    file: null,
    categories: [],
  },
  initial: 'idle',
  states: {
    idle: {
      on: {
        CLICKED_REMOVE_CATEGORY: 'removingCategoryOfFile',
      },
    },
    removingCategoryOfFile: {
      invoke: {
        src: 'removeCategoryOfFile',
        onDone: {
          actions: 'refetchData',
        },
        onError: 'failure',
      },
    },
    failure: {},
  },
});

export default machine;
