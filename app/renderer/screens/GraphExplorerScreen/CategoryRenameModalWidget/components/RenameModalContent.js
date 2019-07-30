import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Input, Message } from 'semantic-ui-react';

const RenameModalContent = ({
  inputText,
  onChangeInputText,
  shouldShowErrorMessage,
  errorMessage,
}) => {
  return (
    <Modal.Content>
      <p>Enter the new name:</p>
      <Input
        type="text"
        value={inputText}
        onChange={({ target }) => onChangeInputText(target.value)}
      />
      {shouldShowErrorMessage ? <Message error content={errorMessage} /> : null}
    </Modal.Content>
  );
};

RenameModalContent.propTypes = {
  inputText: PropTypes.string.isRequired,
  shouldShowErrorMessage: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
};

export default RenameModalContent;
