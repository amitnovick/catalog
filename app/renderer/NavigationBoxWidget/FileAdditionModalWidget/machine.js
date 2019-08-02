//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'file-addition-modal',
  context: {
    errorMessage: '',
    inputText: '',
  },
  initial: 'idle',
  states: {
    idle: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            CLICK_SUBMIT_BUTTON: [
              {
                target: '#file-addition-modal.attemptingToCreateFile',
                cond: 'isValidFileName',
              },
              {
                target: 'failure',
                actions: 'updateErrorMessageInvalidFileName',
              },
            ],
          },
        },
        failure: {},
      },
      on: {
        CHANGE_INPUT_TEXT: {
          target: 'idle',
          actions: 'updateInputText',
        },
      },
    },
    attemptingToCreateFile: {
      invoke: {
        src: 'attemptToCreateFile',
        onDone: {
          actions: 'onFinish', // TODO: Make sure this is the `fileId` retrieved from db
        },
        onError: {
          target: 'idle.failure',
          actions: 'updateErrorMessage',
        },
      },
    },
  },
  on: {
    CLICK_CANCEL_BUTTON: {
      actions: 'onClose',
    },
  },
});

export default machine;
