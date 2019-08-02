import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const MoveToModalActions = ({
  onClickCancelButton,
  onClickSubmitButton,
  isSubmitButtonDisabled,
}) => {
  return (
    <Modal.Actions>
      <Button onClick={onClickCancelButton}>Cancel</Button>
      <Button onClick={onClickSubmitButton} disabled={isSubmitButtonDisabled}>
        Move
      </Button>
    </Modal.Actions>
  );
};

MoveToModalActions.propTypes = {
  onClickCancelButton: PropTypes.func.isRequired,
  onClickSubmitButton: PropTypes.func.isRequired,
  isSubmitButtonDisabled: PropTypes.bool,
};

export default MoveToModalActions;
