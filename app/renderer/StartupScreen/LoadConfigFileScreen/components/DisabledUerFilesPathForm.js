import React from 'react';
import PropTypes from 'prop-types';
import { Button, Header } from 'semantic-ui-react';
import { css } from 'emotion';

const wrapperLabelClass = css`
  cursor: pointer;
  display: inline-block;
`;

const inputClass = css`
  display: none;
`;

const DisabledUserFilesPathForm = ({ onInput }) => {
  return (
    <>
      <Header as="h1">Please choose the directory that would contain your WikiFS Data Files</Header>
      <label className={wrapperLabelClass}>
        <input
          className={inputClass}
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
        <Button as="label" htmlFor="directory-picker" size="massive">
          Choose Directory
        </Button>
      </label>
    </>
  );
};

DisabledUserFilesPathForm.propTypes = {
  onInput: PropTypes.func.isRequired,
};

export default DisabledUserFilesPathForm;
