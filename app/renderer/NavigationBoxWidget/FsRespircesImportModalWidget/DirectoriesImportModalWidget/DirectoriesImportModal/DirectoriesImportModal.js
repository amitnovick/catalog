import React from 'react';

import Modal from '../../../../components/Modal';
import DirectoriesImportModalContentContainer from './containers/DirectoriesImportModalContentContainer';
import DirectoriesImportModalHeader from './components/DirectoriesImportModalHeader';
import DirectoriesImportModalActionsContainer from './containers/DirectoriesImportModalActionsContainer';

const DirectoriesImportModal = ({ onClose }) => {
  return (
    <Modal
      onClose={onClose}
      ModalHeader={<DirectoriesImportModalHeader />}
      ModalContent={<DirectoriesImportModalContentContainer />}
      ModalActions={<DirectoriesImportModalActionsContainer />}
    />
  );
};

export default DirectoriesImportModal;
