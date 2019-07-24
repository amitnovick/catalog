import React from 'react';
import PropTypes from 'prop-types';
import { Button, Header } from 'semantic-ui-react';

const EnabledUserFilesPathForm = ({ onInput, onSubmit }) => {
  return (
    <>
      <Header as="h1">Please choose the directory that would contain your WikiFS Data Files</Header>
      <label htmlFor="directory-picker">User Files path:</label>
      <input
        type="file"
        directory=""
        webkitdirectory=""
        id="directory-picker"
        onChange={() => {
          const directoryPickerElement = document.getElementById('directory-picker');
          const returnedPath =
            directoryPickerElement &&
            directoryPickerElement.files &&
            directoryPickerElement.files[0]
              ? directoryPickerElement.files[0].path
              : undefined;
          onInput(returnedPath);
        }}
      />
      <Button onClick={onSubmit}>File Picker Submit</Button>
    </>
  );
};

EnabledUserFilesPathForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onInput: PropTypes.func.isRequired,
};

export default EnabledUserFilesPathForm;
