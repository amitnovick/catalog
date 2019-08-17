//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'webclips-modal-widget',
  context: {
    currentWebclipsCategory: null,
  },
  initial: 'fetchingWebclipsCategory',
  states: {
    fetchingWebclipsCategory: {
      invoke: {
        src: 'fetchWebclipsCategory',
        onDone: {
          target: 'choosingState',
          actions: 'updateCurrentWebclipsCategory',
        },
        onError: 'failure',
      },
    },
    changingWebclipsCategory: {
      invoke: {
        src: 'changeWebclipsCategory',
        onDone: 'fetchingWebclipsCategory',
        onError: 'failure',
      },
    },
    choosingState: {
      on: {
        '': [
          {
            target: 'categoryExists',
            cond: 'doesWebclipsCategoryExist',
          },
          {
            target: 'noCategory',
          },
        ],
      },
    },
    noCategory: {
      on: {
        CLICK_CHOOSE_CATEGORY_BUTTON: 'choosingCategory',
      },
    },
    choosingCategory: {
      on: {
        CHOSE_CATEGORY: {
          target: 'changingWebclipsCategory',
        },
      },
    },
    categoryExists: {
      on: {
        CLICK_CHANGE_CATEGORY_BUTTON: 'choosingCategory',
      },
    },
    failure: {},
  },
  on: {
    CLICK_CANCEL: {
      actions: 'onClose',
    },
  },
});

export default machine;
