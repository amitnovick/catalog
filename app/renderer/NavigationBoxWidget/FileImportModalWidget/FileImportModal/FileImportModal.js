import React from 'react';

import Modal from '../../../components/Modal';
import FilesImportModalContentContainer from './containers/FilesImportModalContentContainer';
import FileImportModalHeader from './components/FileImportModalHeader';
import FileImportModalActionsContainer from './containers/FileImportModalActionsContainer';

const FileImportModal = ({ onClose }) => {
  return (
    <Modal
      onClose={onClose}
      ModalHeader={<FileImportModalHeader />}
      ModalContent={<FilesImportModalContentContainer />}
      ModalActions={<FileImportModalActionsContainer />}
    />
  );
};

export default FileImportModal;
