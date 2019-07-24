import React from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Label } from 'semantic-ui-react';
import { css } from 'emotion';

const wrapperLabelClass = css`
  cursor: pointer;
  display: inline-block;
`;

const inputClass = css`
  display: none;
`;

const EnabledUserFilesPathForm = ({ onInput, onSubmit, userFilesPath }) => {
  return (
    <>
      <Header as="h1">Please choose the directory that would contain your WikiFS Data Files</Header>
      <Label
        as="label"
        size="massive"
        htmlFor="directory-picker">{`Chosen: ${userFilesPath}`}</Label>
      <label className={wrapperLabelClass}>
        <input
          className={inputClass}
          type="file"
          directory=""
          webkitdirectory=""
          id="directory-picker"
          onInput={() => {
            const directoryPickerElement = document.getElementById('directory-picker');
            const returnedPath =
              directoryPickerElement &&
              directoryPickerElement.files &&
              directoryPickerElement.files[0]
                ? directoryPickerElement.files[0].path
                : undefined;
            if (returnedPath !== undefined) {
              onInput(returnedPath);
            }
          }}
        />
        <Button as="label" htmlFor="directory-picker" size="massive">
          Change Directory
        </Button>
      </label>
      <br />
      <Button positive size="massive" onClick={onSubmit}>
        Save
      </Button>
    </>
  );
};

EnabledUserFilesPathForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onInput: PropTypes.func.isRequired,
  userFilesPath: PropTypes.string.isRequired,
};

export default EnabledUserFilesPathForm;
