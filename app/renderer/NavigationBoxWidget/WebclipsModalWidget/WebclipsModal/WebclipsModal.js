import React from 'react';
import PropTypes from 'prop-types';

import Modal from '../../../components/Modal';
import WebclipsModalHeader from './components/WebclipsModalHeader';
import WebclipsModalActions from './components/WebclipsModalActions';
import WebclipsModalContentContainer from './containers/WebclipsModalContentContainer';

const WebclipsModal = ({ onClose }) => {
  return (
    <Modal
      onClose={onClose}
      ModalHeader={<WebclipsModalHeader />}
      ModalContent={<WebclipsModalContentContainer />}
      ModalActions={<WebclipsModalActions onClickCancelButton={() => onClose()} />}
    />
  );
};

WebclipsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default WebclipsModal;
