import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const AdditionModalActions = ({ onClickCancelButton, onClickSubmitButton }) => {
  return (
    <Modal.Actions>
      <Button onClick={onClickCancelButton}>Cancel</Button>
      <Button onClick={onClickSubmitButton}>Create</Button>
    </Modal.Actions>
  );
};

AdditionModalActions.propTypes = {
  onClickCancelButton: PropTypes.func.isRequired,
  onClickSubmitButton: PropTypes.func.isRequired,
};

export default AdditionModalActions;
