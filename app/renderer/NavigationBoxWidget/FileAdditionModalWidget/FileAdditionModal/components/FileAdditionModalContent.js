import React from 'react';
import PropTypes from 'prop-types';
import { Input, Modal, Icon, Message } from 'semantic-ui-react';

const FileAdditionModalContent = ({
  shouldShouldErrorMessage,
  errorMessage,
  inputText,
  onChangeInputText,
}) => {
  return (
    <Modal.Content image>
      <div className="image">
        <Icon name="file" color="yellow" />
      </div>
      <Modal.Description>
        <p>Choose the name of the new file:</p>
        <Input
          type="text"
          value={inputText}
          onChange={({ target }) => onChangeInputText(target.value)}
        />
        {shouldShouldErrorMessage ? <Message error content={errorMessage} /> : null}
      </Modal.Description>
    </Modal.Content>
  );
};

FileAdditionModalContent.propTypes = {
  shouldShouldErrorMessage: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
};

export default FileAdditionModalContent;
