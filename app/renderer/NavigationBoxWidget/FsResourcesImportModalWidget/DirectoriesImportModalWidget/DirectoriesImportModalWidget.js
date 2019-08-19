import React from 'react';
import { useMachine } from '@xstate/react';
import fsResourcesImportModalMachine from '../fsResourcesImportModalMachine';
import ReactContext from '../ReactContext';
import { assign } from 'xstate';
import store from '../../../redux/store';
import copyDirectory from '../../../fs/copyDirectory';
import queryInsertDirectory from '../../../db/transactions/queryInsertDirectory';
import deleteDirectory from '../../../fs/deleteDirectory';
import FsResourcesImportModal from '../FsResourcesImportModal';

const path = require('path');

const getUserFilesSubdirPath = (store) =>
  store && store.startupScreen ? store.startupScreen.userFilesSubdirFilesPath : null;

const attemptToCopyDirectories = async (directoriesPaths) => {
  const userFilesSubdirPath = getUserFilesSubdirPath(store.getState());
  if (userFilesSubdirPath === null) {
    // Handling error where global value is not available
    return directoriesPaths.reduce((aggregateCopyingOutcomes, directoryPath) => {
      return {
        ...aggregateCopyingOutcomes,
        [directoryPath]: false,
      };
    });
  } else {
    let directoriesCopyingOutcomes = {};
    for (let i = 0; i < directoriesPaths.length; i++) {
      const sourceDirectoryPath = directoriesPaths[i];
      const sourceDirectoryBasePath = path.basename(sourceDirectoryPath);
      const destinationDirectoryPath = path.join(userFilesSubdirPath, sourceDirectoryBasePath);
      try {
        await copyDirectory(sourceDirectoryPath, destinationDirectoryPath);
        directoriesCopyingOutcomes[sourceDirectoryPath] = true;
      } catch (error) {
        directoriesCopyingOutcomes[sourceDirectoryPath] = false;
      }
    }
    return directoriesCopyingOutcomes;
  }
};

const addDirectoriesToDb = async (directoriesPaths) => {
  let directoriesPathAdditionOutcomes = {};
  for (let i = 0; i < directoriesPaths.length; i++) {
    const directoryPath = directoriesPaths[i];
    const directoryBasename = path.basename(directoryPath);
    try {
      await queryInsertDirectory(directoryBasename);
      directoriesPathAdditionOutcomes[directoryPath] = true;
    } catch (error) {
      directoriesPathAdditionOutcomes[directoryPath] = false;
    }
  }
  return directoriesPathAdditionOutcomes;
};

const removeCopiedDirectoriesThatAlreadyExistInDb = async (directoriesPaths) => {
  const directoriesPathsBasenames = directoriesPaths.map((filePath) => path.basename(filePath));
  for (let i = 0; i < directoriesPathsBasenames.length; i++) {
    const directoryPathBasename = directoriesPathsBasenames[i];
    try {
      await deleteDirectory(directoryPathBasename);
    } catch (error) {
      console.log(
        'Error while removing copied file that already exists in db:',
        directoryPathBasename,
      );
    }
  }
};

const attemptToImportFiles = async (directoriesPaths) => {
  const filesPathsCopyingOnFsOutcomes = await attemptToCopyDirectories(directoriesPaths);
  const filesPathsCopiedSuccessfully = Object.entries(filesPathsCopyingOnFsOutcomes).reduce(
    (aggregateFilePathsCopiedSucessfully, [filePath, didCopySuccessfully]) => {
      return didCopySuccessfully
        ? [...aggregateFilePathsCopiedSucessfully, filePath]
        : aggregateFilePathsCopiedSucessfully;
    },
    [],
  );
  const filePathsAddedToDbOutcome = await addDirectoriesToDb(filesPathsCopiedSuccessfully);
  const copiedFilesThatAlreadyExistInDb = filesPathsCopiedSuccessfully.filter(
    (filePath) => filePathsAddedToDbOutcome[filePath] === false,
  );
  try {
    await removeCopiedDirectoriesThatAlreadyExistInDb(copiedFilesThatAlreadyExistInDb);
  } catch (error) {
    console.log('Error while removing copied files that already exist in db:', error);
  }

  const finalFilesPathsOutcomes = Object.entries(filesPathsCopyingOnFsOutcomes).reduce(
    (aggregateFinalFilesPathsOutcomes, [filePath, didCopySuccessfully]) => {
      return {
        ...aggregateFinalFilesPathsOutcomes,
        [filePath]: didCopySuccessfully && filePathsAddedToDbOutcome[filePath],
      };
    },
    {},
  );
  return finalFilesPathsOutcomes;
};

const machineWithConfig = fsResourcesImportModalMachine.withConfig({
  services: {
    attemptToImportFiles: (context, __) => attemptToImportFiles(context.filesPaths),
  },
  actions: {
    updateFilesPaths: assign({ filesPaths: (_, event) => event.filesPaths }),
    updateFilePathsAttemptOutcomes: assign({ filePathsAttemptOutcomes: (_, event) => event.data }),
  },
});

const DirectoriesImportModalWidget = ({ onClose }) => {
  const [, , service] = useMachine(machineWithConfig, {
    actions: {
      onClose: (_, __) => onClose(),
    },
  });
  return (
    <ReactContext.Provider value={service}>
      <FsResourcesImportModal fsResourceType="directory" onClose={onClose} />
    </ReactContext.Provider>
  );
};

export default DirectoriesImportModalWidget;
