import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FileNameContainer from './FileNameContainer';
import { useMachine } from '@xstate/react';
import machine from './machine';
import store from '../../../redux/store';
import { RECEIVE_ENTITIES } from '../actionTypes';
import { Icon, Message } from 'semantic-ui-react';
import queryUpdateFileName from '../../../query-functions/queryUpdateFileName';
import renameFile from '../../../utils/renameFile';
const isValidFilename = require('valid-filename');

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

const attemptToRenameFile = async (file, newFileName) => {
  await queryUpdateFileName(file.id, newFileName);
  try {
    return await renameFile(file.name, newFileName);
  } catch (error) {
    try {
      await queryUpdateFileName(file.id, file.name); // Revert rename
      throw new Error(`A file with the name ${newFileName} already exists!`);
    } catch (error2) {
      throw new Error(`Unknown error: ${error2.message}`);
    }
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

const updateErrorMessage = (errorMessage) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      fileNameWidgetErrorMessage: errorMessage,
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
    updateErrorMessage: (_, event) => updateErrorMessage(event.data.message),
  },
  guards: {
    isNewFileNameValidFileName: (_, event) => isNewFileNameValidFileName(event.newFileName),
  },
});

const FileNameWidget = ({ refetchFileData, errorMessage }) => {
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
      {current.matches('idle.failure') ? (
        <>
          <Icon size="big" name="remove" color="red" />
          <Message error content={errorMessage} />
        </>
      ) : null}
    </>
  );
};

FileNameWidget.propTypes = {
  refetchFileData: PropTypes.func.isRequired,
};

const getErrorMessage = (store) =>
  store && store.specificTagScreen ? store.specificTagScreen.fileNameWidgetErrorMessage : '';

export default connect((state) => ({
  errorMessage: getErrorMessage(state),
}))(FileNameWidget);
