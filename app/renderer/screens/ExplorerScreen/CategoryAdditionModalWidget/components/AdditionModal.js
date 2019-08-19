import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../../../../components/Modal';
import AdditionModalHeader from './AdditionModalHeader';
import AdditionModalActions from './AdditionModalActions';
import AdditionModalContentContainer from '../containers/AdditionModalContentContainer';

const AdditionModal = ({
  onClickSubmitButton,
  onClose,
  onChangeInputText,
  shouldShowErrorMessage,
}) => {
  return (
    <Modal
      onClose={onClose}
      ModalHeader={<AdditionModalHeader />}
      ModalContent={
        <AdditionModalContentContainer
          onChangeInputText={onChangeInputText}
          shouldShowErrorMessage={shouldShowErrorMessage}
          onHitEnterKey={onClickSubmitButton}
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
