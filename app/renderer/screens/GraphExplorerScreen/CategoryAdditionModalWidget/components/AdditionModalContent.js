import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Input, Message, Icon } from 'semantic-ui-react';

const AdditionModalContent = ({
  inputText,
  onChangeInputText,
  shouldShowErrorMessage,
  errorMessage,
}) => {
  return (
    <Modal.Content image>
      <div className="image">
        <Icon name="folder" color="blue" />
      </div>
      <Modal.Description>
        <p>Enter a name for the new category:</p>
        <Input
          type="text"
          value={inputText}
          onChange={({ target }) => onChangeInputText(target.value)}
        />
      </Modal.Description>
      {shouldShowErrorMessage ? <Message error content={errorMessage} /> : null}
    </Modal.Content>
  );
};

AdditionModalContent.propTypes = {
  inputText: PropTypes.string.isRequired,
  shouldShowErrorMessage: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
};

export default AdditionModalContent;
