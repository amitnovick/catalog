//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'main',
  initial: 'allFiles',
  states: {
    allFiles: {
      on: {
        CLICK_FILES_UNDER_CATEGORY_TAB: 'filesUnderCategory',
      },
    },
    filesUnderCategory: {
      on: {
        CLICK_ALL_FILES_TAB: 'allFiles',
      },
    },
  },
});

export default machine;
