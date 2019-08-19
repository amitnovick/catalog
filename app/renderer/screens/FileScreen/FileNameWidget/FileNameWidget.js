import React from 'react';
import PropTypes from 'prop-types';
import { useMachine } from '@xstate/react';
import { Icon, Message } from 'semantic-ui-react';
import { assign } from 'xstate';

import FileName from './FileName';
import machine from './machine';
import queryUpdateFileName from '../../../db/queries/queryUpdateFsResourceName';
import renameFsResourceInUserFiles from '../../../fs/renameFsResourceInUserFiles';

const isValidFilename = require('valid-filename');

const isNewFileNameValidFileName = (newFileName) => {
  return isValidFilename(newFileName) && newFileName.trim() !== '';
};

const attemptToRenameFile = async (file, newFileName) => {
  await queryUpdateFileName(file.id, newFileName);
  try {
    return await renameFsResourceInUserFiles(file.name, newFileName);
  } catch (error) {
    try {
      await queryUpdateFileName(file.id, file.name); // Revert rename
      throw new Error(`A file with the name ${newFileName} already exists!`);
    } catch (error2) {
      throw new Error(`Unknown error: ${error2.message}`);
    }
  }
};

const machineWithConfig = machine.withConfig({
  services: {
    attemptToRenameFile: (_, event) => attemptToRenameFile(event.file, event.newFileName),
  },
  actions: {
    resetNewFileNameToFileName: assign({ newFileName: (context, _) => context.file.name }),
    updateInputText: assign({ newFileName: (_, event) => event.inputText }),
    updateErrorMessage: assign({ errorMessage: (_, event) => event.data.message }),
    updateErrorMessageInvalidFileName: assign({
      errorMessage: (_, event) => `Error: The name ${event.newFileName} is not a valid file name.`,
    }),
  },
  guards: {
    isNewFileNameValidFileName: (_, event) => isNewFileNameValidFileName(event.newFileName),
  },
});

const FileNameWidget = ({ refetchFileData, notifySuccess, file }) => {
  const [current, send] = useMachine(
    machineWithConfig.withContext({
      ...machineWithConfig.initialState.context,
      file: file,
      newFileName: file.name,
    }),
    {
      actions: {
        refetchFileData: (_, __) => refetchFileData(),
        notifySuccess: (_, __) => notifySuccess(),
      },
    },
  );

  const { errorMessage, newFileName } = current.context;

  return (
    <div>
      <div>
        <FileName
          onChangeInputText={(inputText) => send('CHANGE_INPUT_TEXT', { inputText })}
          onClickRenameFile={(file, newFileName) =>
            send('CLICK_RENAME_FILE', {
              file: file,
              newFileName: newFileName,
            })
          }
          file={file}
          newFileName={newFileName}
        />
        {current.matches('idle.failure') ? <Icon size="big" name="remove" color="red" /> : null}
      </div>
      {current.matches('idle.success') ? <Icon size="big" name="checkmark" color="green" /> : null}
      {current.matches('idle.failure') ? <Message error content={errorMessage} /> : null}
    </div>
  );
};

FileNameWidget.propTypes = {
  refetchFileData: PropTypes.func.isRequired,
  notifySuccess: PropTypes.func.isRequired,
  file: PropTypes.object.isRequired,
};

export default FileNameWidget;
