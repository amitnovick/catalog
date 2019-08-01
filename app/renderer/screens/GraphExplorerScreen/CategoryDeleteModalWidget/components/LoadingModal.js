import React from 'react';
import Modal from './Modal';
import { Modal as SemanticModal, Header } from 'semantic-ui-react';

const LoadingModal = ({ onClose, category }) => {
  return (
    <Modal
      onClose={onClose}
      ModalHeader={
        <SemanticModal.Header>
          <Header as="h3" textAlign="center">
            {`Delete "${category.name}"`}
          </Header>
        </SemanticModal.Header>
      }
    />
  );
};

export default LoadingModal;
