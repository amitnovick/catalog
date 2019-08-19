import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const RenameModalActions = ({ onClickCancelButton, onClickRenameButton }) => {
  return (
    <Modal.Actions>
      <Button onClick={onClickCancelButton}>Cancel</Button>
      <Button onClick={onClickRenameButton}>Rename</Button>
    </Modal.Actions>
  );
};

RenameModalActions.propTypes = {
  onClickCancelButton: PropTypes.func.isRequired,
  onClickRenameButton: PropTypes.func.isRequired,
};

export default RenameModalActions;

// import React from 'react';

// export default () => {
//   return <h2>Hi</h2>;
// };
