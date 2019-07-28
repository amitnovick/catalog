//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'file-name-widget',
  initial: 'idle',
  states: {
    idle: {
      initial: 'idle',
      states: {
        idle: {},
        failure: {},
        success: {},
      },
      on: {
        CLICK_RENAME_FILE: [
          {
            target: 'attemptingToRenameFile',
            cond: 'isNewFileNameValidFileName',
          },
          {
            target: 'idle.failure',
          },
        ],
        CHANGE_INPUT_TEXT: {
          target: 'idle.idle',
          actions: 'updateInputText',
        },
      },
    },
    attemptingToRenameFile: {
      invoke: {
        src: 'attemptToRenameFile',
        onDone: {
          target: 'idle.success',
          actions: 'refetchFileData',
        },
        onError: {
          target: 'idle.failure',
          actions: 'resetNewFileNameToFileName',
        },
      },
    },
  },
});

export default machine;