import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Input, Message, Icon } from 'semantic-ui-react';

const RenameModalContent = ({
  inputText,
  onChangeInputText,
  shouldShowErrorMessage,
  errorMessage,
  onHitEnterKey,
}) => {
  return (
    <Modal.Content image>
      <div className="image">
        <Icon name="folder" color="blue" />
      </div>
      <Modal.Description>
        <p>Enter the new name:</p>
        <Input
          autoFocus
          type="text"
          value={inputText}
          onKeyUp={({ key }) => (key === 'Enter' ? onHitEnterKey() : null)}
          onChange={({ target }) => onChangeInputText(target.value)}
        />
        {shouldShowErrorMessage ? <Message error content={errorMessage} /> : null}
      </Modal.Description>
    </Modal.Content>
  );
};

RenameModalContent.propTypes = {
  inputText: PropTypes.string.isRequired,
  shouldShowErrorMessage: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  onHitEnterKey: PropTypes.func.isRequired,
  onChangeInputText: PropTypes.func.isRequired,
};

export default RenameModalContent;
