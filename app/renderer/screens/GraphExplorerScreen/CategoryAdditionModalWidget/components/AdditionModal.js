import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../../../../components/Modal';
import RenameModalHeader from '../components/AdditionModalHeader';
import AdditionModalActions from './AdditionModalActions';
import RenameModalContentContainer from '../containers/AdditionModalContentContainer';

const AdditionModal = ({
  onClickSubmitButton,
  onClose,
  onChangeInputText,
  shouldShowErrorMessage,
}) => {
  return (
    <Modal
      onClose={onClose}
      ModalHeader={<RenameModalHeader />}
      ModalContent={
        <RenameModalContentContainer
          onChangeInputText={onChangeInputText}
          shouldShowErrorMessage={shouldShowErrorMessage}
        />
      }
      ModalActions={
        <AdditionModalActions
          onClickCancelButton={onClose}
          onClickSubmitButton={onClickSubmitButton}
        />
      }
    />
  );
};

AdditionModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onClickSubmitButton: PropTypes.func.isRequired,
  onChangeInputText: PropTypes.func.isRequired,
  shouldShowErrorMessage: PropTypes.bool.isRequired,
};

export default AdditionModal;
