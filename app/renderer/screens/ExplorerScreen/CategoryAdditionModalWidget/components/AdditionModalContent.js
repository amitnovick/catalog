import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Input, Message, Header } from 'semantic-ui-react';
import CategoryIcon from '../../../../components/CategoryIcon';

const AdditionModalContent = ({
  inputText,
  onChangeInputText,
  shouldShowErrorMessage,
  errorMessage,
  onHitEnterKey,
}) => {
  return (
    <Modal.Content image>
      <div className="image">
        <CategoryIcon size="10x" />
      </div>
      <Modal.Description>
        <Header as="h3">Enter a name for the new category:</Header>
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

AdditionModalContent.propTypes = {
  inputText: PropTypes.string.isRequired,
  shouldShowErrorMessage: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  onChangeInputText: PropTypes.func.isRequired,
  onHitEnterKey: PropTypes.func.isRequired,
};

export default AdditionModalContent;
