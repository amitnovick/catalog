import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const FileAdditionModalActions = ({
  onClickCancelButton,
  onClickSubmitButton,
  shouldDisableSubmitButton,
}) => {
  return (
    <Modal.Actions>
      <Button onClick={onClickCancelButton}>Cancel</Button>
      <Button onClick={onClickSubmitButton} disabled={shouldDisableSubmitButton}>
        Create
      </Button>
    </Modal.Actions>
  );
};

FileAdditionModalActions.propTypes = {
  onClickCancelButton: PropTypes.func.isRequired,
  onClickSubmitButton: PropTypes.func.isRequired,
  shouldDisableSubmitButton: PropTypes.bool.isRequired,
};

export default FileAdditionModalActions;
