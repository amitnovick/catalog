//@ts-check
import { Machine } from 'xstate';

const configFileMachine = Machine({
  id: 'config-file',
  initial: 'fetchingAppDataPath',
  states: {
    fetchingAppDataPath: {
      onEntry: ['sendEventToMainProcess'],
      on: {
        RECEIVE_APP_DATA_PATH: 'attemptingToReadConfigFile',
      },
    },
    attemptingToReadConfigFile: {
      invoke: {
        src: 'attemptToReadConfigFile',
        onDone: '#config-file.checkingUserFilesDirExists',
        onError: 'configFileDoesntExist',
      },
    },
    configFileDoesntExist: {
      initial: 'askingForUserFilesPath',
      states: {
        askingForUserFilesPath: {
          initial: 'submitButtonDisabled',
          states: {
            submitButtonDisabled: {
              on: {
                INPUT_DIRECTORY_PATH: 'submitButtonEnabled',
              },
            },
            submitButtonEnabled: {
              on: {
                CLICK_SUBMIT_DIRECTORY_PATH_BUTTON:
                  '#config-file.configFileDoesntExist.writingUserFilesPathToConfigFile',
              },
            },
          },
        },
        writingUserFilesPathToConfigFile: {
          invoke: {
            src: 'writeUserFilesPathToConfigFile',
            onDone: '#config-file.checkingUserFilesDirExists',
            onError: '#config-file.couldntWriteToConfigFileError',
          },
        },
      },
    },
    checkingUserFilesDirExists: {
      invoke: {
        src: 'checkUserFilesDirExists',
        onDone: 'finished',
        onError: 'userFilesDirDoesntExistError',
      },
    },
    finished: {
      type: 'final',
    },
    couldntWriteToConfigFileError: {
      type: 'final',
    },
    userFilesDirDoesntExistError: {
      on: {
        CLICK_PROVIDE_DIFFERENT_DIRECTORY: 'configFileDoesntExist',
      },
    },
  },
});

export default configFileMachine;
