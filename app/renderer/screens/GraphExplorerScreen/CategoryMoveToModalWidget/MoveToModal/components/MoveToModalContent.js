import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Icon } from 'semantic-ui-react';

const MoveToModalContent = ({ ModalContent }) => {
  return (
    <Modal.Content image>
      <div className="image">
        <Icon name="folder" color="blue" />
      </div>
      <Modal.Description>
        <p>Choose the category to move to:</p>
        {ModalContent !== undefined ? <ModalContent /> : null}
      </Modal.Description>
    </Modal.Content>
  );
};

MoveToModalContent.propTypes = {
  ModalContent: PropTypes.any,
};

export default MoveToModalContent;
