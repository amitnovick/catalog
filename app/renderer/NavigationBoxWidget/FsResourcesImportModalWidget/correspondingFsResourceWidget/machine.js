import { Machine } from 'xstate';

//@ts-check

const machine = Machine({
  id: 'file-import-modal',
  initial: 'choosing',
  context: {
    filesPaths: [],
    filePathsAttemptOutcomes: {},
  },
  states: {
    choosing: {
      on: {
        CHOOSE_FILES: {
          target: '#file-import-modal.chosen',
          actions: 'updateFilesPaths',
        },
      },
    },
    chosen: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            CLICK_IMPORT_BUTTON: 'attemptingToImportFiles',
          },
        },
        attemptingToImportFiles: {
          invoke: {
            src: 'attemptToImportFiles',
            onDone: {
              target: 'displayAttemptOutcome',
              actions: 'updateFilePathsAttemptOutcomes',
            },
          },
        },
        displayAttemptOutcome: {},
      },
    },
  },
  on: {
    CLICK_CANCEL: {
      actions: 'onClose',
    },
  },
});

export default machine;
