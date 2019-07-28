import React from 'react';
import PropTypes from 'prop-types';
import FileNameContainer from './FileNameContainer';
import { useMachine } from '@xstate/react';
import machine from './machine';
import store from '../../../redux/store';
import { RECEIVE_ENTITIES } from '../actionTypes';
import formatFilePath from '../../../utils/formatFilePath';
import getSqlDriver from '../../../sqlDriver';
import { updateFileName } from '../../../sql_queries';
import { Icon } from 'semantic-ui-react';
const isValidFilename = require('valid-filename');
const fs = require('fs');

const isNewFileNameValidFileName = (newFileName) => {
  return isValidFilename(newFileName) && newFileName.trim() !== '';
};

const getFile = (store) => (store && store.specificTagScreen ? store.specificTagScreen.file : '');

const resetNewFileNameToFileName = () => {
  const file = getFile(store.getState());
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      newFileName: file.name,
    },
  });
};

const fileNameAlreadyExistsErrorMessage = `SQLITE_CONSTRAINT: UNIQUE constraint failed: files.name`;

const renameFileToFs = (oldFileName, newFileName) =>
  new Promise((resolve, reject) => {
    const oldFilePath = formatFilePath(oldFileName);
    const newFilePath = formatFilePath(newFileName);
    fs.rename(oldFilePath, newFilePath, (err) => {
      if (err) {
        console.log('unknown error occurred:', err);
        reject();
      } else {
        console.log('The file has been renamed!');
        resolve();
      }
    });
  });

const queryRenameFileInDb = (fileId, newFileName) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      updateFileName,
      {
        $file_name: newFileName,
        $file_id: fileId,
      },
      function(err) {
        if (err) {
          if (err.message === fileNameAlreadyExistsErrorMessage) {
            console.log('Error: file name already exists in db');
          } else {
            console.log('unknown error:', err);
          }
          reject();
        } else {
          const { changes: affectedRowsCount } = this;
          if (affectedRowsCount !== 1) {
            console.log('No affected rows error');
            reject();
          } else {
            resolve();
          }
        }
      },
    );
  });
};

const attemptToRenameFile = async (file, newFileName) => {
  await queryRenameFileInDb(file.id, newFileName);
  try {
    return await renameFileToFs(file.name, newFileName);
  } catch (error) {
    await queryRenameFileInDb(file.id, file.name); // Revert rename
    throw error;
  }
};

const updateNewFileName = (inputText) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      newFileName: inputText,
    },
  });
};

const machineWithConfig = machine.withConfig({
  services: {
    attemptToRenameFile: (_, event) => attemptToRenameFile(event.file, event.newFileName),
  },
  actions: {
    resetNewFileNameToFileName: (_, __) => resetNewFileNameToFileName(),
    updateInputText: (_, event) => updateNewFileName(event.inputText),
  },
  guards: {
    isNewFileNameValidFileName: (_, event) => isNewFileNameValidFileName(event.newFileName),
  },
});

const FileNameWidget = ({ refetchFileData }) => {
  const [current, send] = useMachine(machineWithConfig, {
    actions: {
      refetchFileData: (_, __) => refetchFileData(),
    },
  });
  return (
    <>
      <FileNameContainer
        onChangeInputText={(inputText) => send('CHANGE_INPUT_TEXT', { inputText })}
        onClickRenameFile={(file, newFileName) =>
          send('CLICK_RENAME_FILE', {
            file: file,
            newFileName: newFileName,
          })
        }
      />
      {current.matches('idle.success') ? <Icon size="big" name="checkmark" color="green" /> : null}
      {current.matches('idle.failure') ? <Icon size="big" name="remove" color="red" /> : null}
    </>
  );
};

FileNameWidget.propTypes = {
  refetchFileData: PropTypes.func.isRequired,
};

export default FileNameWidget;
