import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const WebclipsModalActions = ({ onClickCancelButton }) => {
  return (
    <Modal.Actions>
      <Button onClick={onClickCancelButton}>Close</Button>
    </Modal.Actions>
  );
};

WebclipsModalActions.propTypes = {
  onClickCancelButton: PropTypes.func.isRequired,
};

export default WebclipsModalActions;
