import React from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import RenameModalHeaderContainer from '../containers/RenameModalHeaderContainer.';
import RenameModalActions from './RenameModalActions';
import RenameModalContentContainer from '../containers/RenameModalContentContainer';

const RenameModal = ({
  isOpen,
  onClickRenameButton,
  onClose,
  onChangeInputText,
  shouldShowErrorMessage,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ModalHeader={<RenameModalHeaderContainer />}
      ModalContent={
        <RenameModalContentContainer
          onChangeInputText={onChangeInputText}
          shouldShowErrorMessage={shouldShowErrorMessage}
        />
      }
      ModalActions={
        <RenameModalActions
          onClickCancelButton={onClose}
          onClickRenameButton={onClickRenameButton}
        />
      }
    />
  );
};

RenameModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onClickRenameButton: PropTypes.func.isRequired,
  onChangeInputText: PropTypes.func.isRequired,
  shouldShowErrorMessage: PropTypes.bool.isRequired,
};

export default RenameModal;
