import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'semantic-ui-react';

const UserFilesPathForm = ({
  chosenUserFilesPath,
  onChangeChosenUserFilesPath,
  onSubmit
}) => {
  return (
    <>
      <label htmlFor="user-files-path-input">User Files path:</label>
      <Input
        type="text"
        id="user-files-path-input"
        value={chosenUserFilesPath}
        onChange={({ target }) => onChangeChosenUserFilesPath(target.value)}
      />
      <Button onClick={onSubmit}>Submit</Button>
    </>
  );
};

UserFilesPathForm.propTypes = {
  chosenUserFilesPath: PropTypes.string.isRequired,
  onChangeChosenUserFilesPath: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default UserFilesPathForm;
