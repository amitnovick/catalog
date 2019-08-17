//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'file-name-widget',
  context: {
    file: null,
    errorMessage: null,
    newFileName: null,
  },
  initial: 'idle',
  states: {
    idle: {
      initial: 'idle',
      states: {
        idle: {},
        failure: {},
      },
      on: {
        CLICK_RENAME_FILE: [
          {
            target: 'attemptingToRenameFile',
            cond: 'isNewFileNameValidFileName',
          },
          {
            target: 'idle.failure',
            actions: ['updateErrorMessageInvalidFileName', 'resetNewFileNameToFileName'],
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
          actions: ['notifySuccess', 'refetchFileData'],
        },
        onError: {
          target: 'idle.failure',
          actions: ['updateErrorMessage', 'resetNewFileNameToFileName'],
        },
      },
    },
  },
});

export default machine;
