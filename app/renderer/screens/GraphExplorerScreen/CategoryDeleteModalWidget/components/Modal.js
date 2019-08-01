import React from 'react';
import { Modal as SemanticModal } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const Modal = ({ isOpen, onClose, ModalHeader, ModalContent, ModalActions }) => {
  return (
    <SemanticModal
      closeIcon={{ style: { top: '0.8rem', right: '1rem' }, color: 'red', name: 'close' }}
      dimmer="inverted"
      open={isOpen}
      onClose={onClose}>
      {ModalHeader !== undefined ? ModalHeader : null}
      {ModalContent !== undefined ? ModalContent : null}
      {ModalActions !== undefined ? ModalActions : null}
    </SemanticModal>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  ModalHeader: PropTypes.node,
  ModalContent: PropTypes.node,
  ModalActions: PropTypes.node,
};

export default Modal;
