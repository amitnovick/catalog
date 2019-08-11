//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'webclip-widget',
  initial: 'fetchingWebclipData',
  context: {
    pageUrl: null,
    pageTitle: null,
    fileId: null,
    errorMessage: null,
  },
  states: {
    fetchingWebclipData: {
      invoke: {
        src: 'fetchWebclipData',
        onDone: [
          { target: 'hasWebclipData', actions: 'updateWebclipData', cond: 'doesWebclipDataExist' },
          { target: 'noWebclipData' },
        ],
        onError: {
          target: 'failure',
          actions: 'updateErrorMessage',
        },
      },
    },
    hasWebclipData: {
      type: 'final',
    },
    failure: {
      type: 'final',
    },
    noWebclipData: {
      type: 'final',
    },
  },
});

export default machine;
