import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const FileImportModalActions = ({
  onClickCancelButton,
  onClickSubmitButton,
  shouldDisableSubmitButton,
}) => {
  return (
    <Modal.Actions>
      <Button onClick={onClickCancelButton}>Close</Button>
      <Button onClick={onClickSubmitButton} disabled={shouldDisableSubmitButton}>
        Import
      </Button>
    </Modal.Actions>
  );
};

FileImportModalActions.propTypes = {
  onClickCancelButton: PropTypes.func.isRequired,
  onClickSubmitButton: PropTypes.func.isRequired,
  shouldDisableSubmitButton: PropTypes.bool.isRequired,
};

export default FileImportModalActions;