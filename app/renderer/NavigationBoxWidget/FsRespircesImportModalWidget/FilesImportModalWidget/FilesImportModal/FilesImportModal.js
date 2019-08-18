import React from 'react';

import Modal from '../../../../components/Modal';
import FilesImportModalContentContainer from './containers/FilesImportModalContentContainer';
import FilesImportModalHeader from './components/FilesImportModalHeader';
import FilesImportModalActionsContainer from './containers/FilesImportModalActionsContainer';

const FilesImportModal = ({ onClose }) => {
  return (
    <Modal
      onClose={onClose}
      ModalHeader={<FilesImportModalHeader />}
      ModalContent={<FilesImportModalContentContainer />}
      ModalActions={<FilesImportModalActionsContainer />}
    />
  );
};

export default FilesImportModal;
