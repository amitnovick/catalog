//@ts-check
import { Machine } from 'xstate';

const configFileMachine = Machine({
  id: 'config-file',
  initial: 'fetchingAppDataPath',
  states: {
    fetchingAppDataPath: {
      onEntry: ['sendEventToMainProcess'],
      on: {
        RECEIVE_APP_DATA_PATH: 'attemptingToReadConfigFile'
      }
    },
    attemptingToReadConfigFile: {
      invoke: {
        src: 'attemptToReadConfigFile',
        onDone: '#config-file.checkingUserFilesDirExists',
        onError: 'configFileDoesntExist'
      }
    },
    configFileDoesntExist: {
      initial: 'askingForUserFilesPath',
      states: {
        askingForUserFilesPath: {
          on: {
            SUBMIT_SAVE_LOCATION: {
              target: 'writingUserFilesPathToConfigFile',
              actions: 'updateUserFilesPath'
            }
          }
        },
        writingUserFilesPathToConfigFile: {
          invoke: {
            src: 'writeUserFilesPathToConfigFile',
            onDone: '#config-file.checkingUserFilesDirExists',
            onError: '#config-file.couldntWriteToConfigFileError'
          }
        }
      }
    },
    checkingUserFilesDirExists: {
      invoke: {
        src: 'checkUserFilesDirExists',
        onDone: 'finished',
        onError: 'userFilesDirDoesntExistError'
      }
    },
    finished: {
      type: 'final'
    },
    couldntWriteToConfigFileError: {
      type: 'final'
    },
    userFilesDirDoesntExistError: {
      on: {
        CLICK_PROVIDE_DIFFERENT_DIRECTORY: 'configFileDoesntExist'
      }
    }
  }
});

export default configFileMachine;
