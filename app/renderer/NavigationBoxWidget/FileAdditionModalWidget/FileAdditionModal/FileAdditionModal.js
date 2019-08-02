import React from 'react';

import Modal from '../../../components/Modal';
import FileAdditionModalHeader from './components/FileAdditionModalHeader';
import FileAdditionModalContentContainer from './containers/FileAdditionModalContentContainer';
import FileAdditionModalActionsContainer from './containers/FileAdditionModalActionsContainer';

const FileAdditionModal = ({ onClose }) => {
  return (
    <Modal
      onClose={onClose}
      ModalHeader={<FileAdditionModalHeader />}
      ModalContent={<FileAdditionModalContentContainer />}
      ModalActions={<FileAdditionModalActionsContainer />}
    />
  );
};

export default FileAdditionModal;
