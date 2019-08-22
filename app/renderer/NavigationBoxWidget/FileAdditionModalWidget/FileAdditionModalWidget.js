import React from 'react';
import { useMachine } from '@xstate/react';

import ReactContext from './ReactContext';
import machine from './machine';
import FileAdditionModal from './FileAdditionModal/FileAdditionModal';
import { assign } from 'xstate';
import queryInsertFile from '../../db/transactions/queryInsertFile';
import writeFile from '../../fs/writeFile';
import queryDeleteFsResourceByName from '../../db/queries/queryDeleteFsResourceByName';
import isFileNameValid from '../../utils/isFileNameValid';

const attemptToCreateFile = (fileName) => {
  return new Promise(async (resolve, reject) => {
    const fileId = await queryInsertFile(fileName);
    try {
      await writeFile(fileName);
      resolve(fileId);
    } catch (error) {
      try {
        await queryDeleteFsResourceByName(fileName); // clean up after `insertFileToDb`
        reject(error);
      } catch (error2) {
        const errorMessage = `Two errors: 1.${error.message}, 2. ${error2.message}`;
        reject(new Error(errorMessage));
      }
    }
  });
};

const machineWithConfig = machine.withConfig({
  actions: {
    updateErrorMessage: assign({ errorMessage: (_, event) => event.data.message }),
    updateInputText: assign({ inputText: (_, event) => event.inputText }),
    updateErrorMessageInvalidFileName: assign({ errorMessage: (_, __) => 'Invalid file name' }),
  },
  services: {
    attemptToCreateFile: (context, _) => attemptToCreateFile(context.inputText),
  },
  guards: {
    isValidFileName: (context, _) => isFileNameValid(context.inputText),
  },
});

const FileAdditionModalWidget = ({ onClose, onFinish }) => {
  const [, , service] = useMachine(machineWithConfig, {
    actions: {
      onFinish: (_, event) => onFinish(event.data),
      onClose: (_, __) => onClose(),
    },
    devTools: true,
  });
  return (
    <ReactContext.Provider value={service}>
      <FileAdditionModal onClose={onClose} />
    </ReactContext.Provider>
  );
};

export default FileAdditionModalWidget;
