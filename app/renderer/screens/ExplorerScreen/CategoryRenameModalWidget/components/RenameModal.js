import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../../../../components/Modal';
import RenameModalHeaderContainer from '../containers/RenameModalHeaderContainer.';
import RenameModalActions from './RenameModalActions';
import RenameModalContentContainer from '../containers/RenameModalContentContainer';

const RenameModal = ({
  onClickRenameButton: onSubmit,
  onClose,
  onChangeInputText,
  shouldShowErrorMessage,
}) => {
  return (
    <Modal
      onClose={onClose}
      ModalHeader={<RenameModalHeaderContainer />}
      ModalContent={
        <RenameModalContentContainer
          onChangeInputText={onChangeInputText}
          shouldShowErrorMessage={shouldShowErrorMessage}
          onHitEnterKey={onSubmit}
        />
      }
      ModalActions={
        <RenameModalActions onClickCancelButton={onClose} onClickRenameButton={onSubmit} />
      }
    />
  );
};

RenameModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onClickRenameButton: PropTypes.func.isRequired,
  onChangeInputText: PropTypes.func.isRequired,
  shouldShowErrorMessage: PropTypes.bool.isRequired,
};

export default RenameModal;
