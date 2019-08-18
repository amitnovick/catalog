import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const FsResourcesImportModalActions = ({ onClickCancelButton }) => {
  return (
    <Modal.Actions>
      <Button onClick={onClickCancelButton}>Close</Button>
    </Modal.Actions>
  );
};

FsResourcesImportModalActions.propTypes = {
  onClickCancelButton: PropTypes.func.isRequired,
};

export default FsResourcesImportModalActions;
