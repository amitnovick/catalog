import React from 'react';
import { useMachine } from '@xstate/react';

import ReactContext from './ReactContext';
import machine from './machine';
import FileAdditionModal from './FileAdditionModal/FileAdditionModal';
import { assign } from 'xstate';
import queryInsertFile from '../../query-functions/queryInsertFile';
import writeFile from '../../utils/writeFile';
import queryDeleteFile from '../../query-functions/queryDeleteFile';
const isValidFilename = require('valid-filename');

const attemptToCreateFile = async (fileName) => {
  const fileId = await queryInsertFile(fileName);
  try {
    await writeFile(fileName);
    return Promise.resolve(fileId);
  } catch (error) {
    await queryDeleteFile(fileName); // clean up after `insertFileToDb`
    return Promise.reject(error);
  }
};

const isFileNameValid = (fileName) => {
  return isValidFilename(fileName) && fileName.trim() !== '';
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
