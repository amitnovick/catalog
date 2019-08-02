import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../../Modal';
import MoveToModalHeaderContainer from './containers/MoveToModalHeaderContainer';
import MoveToModalContentContainer from './containers/MoveToModalContentContainer';
import MoveToModalActionsContainer from './containers/MoveToModalActionsContainer';

const MoveToModal = ({ onClose }) => {
  return (
    <Modal
      onClose={onClose}
      ModalHeader={<MoveToModalHeaderContainer />}
      ModalContent={<MoveToModalContentContainer />}
      ModalActions={<MoveToModalActionsContainer />}
    />
  );
};

MoveToModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default MoveToModal;
