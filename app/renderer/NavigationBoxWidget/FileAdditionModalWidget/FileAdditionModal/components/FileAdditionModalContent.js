import React from 'react';
import PropTypes from 'prop-types';
import { Input, Modal, Icon, Message, Header } from 'semantic-ui-react';

const FileAdditionModalContent = ({
  shouldShouldErrorMessage,
  errorMessage,
  inputText,
  onChangeInputText,
  onHitEnterKey,
}) => {
  return (
    <Modal.Content image>
      <div className="image">
        <Icon name="file" color="yellow" />
      </div>
      <Modal.Description>
        <Header as="h3">Choose the name of the new file:</Header>
        <Input
          autoFocus
          onKeyUp={({ key }) => (key === 'Enter' ? onHitEnterKey() : null)}
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
  inputText: PropTypes.string.isRequired,
  onChangeInputText: PropTypes.func.isRequired,
  onHitEnterKey: PropTypes.func.isRequired,
};

export default FileAdditionModalContent;
