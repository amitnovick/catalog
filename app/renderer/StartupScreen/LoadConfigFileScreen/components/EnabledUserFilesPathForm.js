import React from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Label } from 'semantic-ui-react';
import { css } from 'emotion';

/* TODO:
  - This component and `DisabledUserFIlesPathForm` should be refactored due to shared functionality that should not diverge
  - This component implements non-trivial tricks that should probably be refactored into an external component entirely, to emphasize that it works only for Electron environment
*/

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
      <label
        className={
          wrapperLabelClass
        } /* Note: The Default aesthetics where the <input/> displays "No file selected" after being provided a directory is unwanted, therefore this approach hides the <input/> in favor of another styled element (a Button is currently implemented here). Approach found on SO: https://stackoverflow.com/a/43007664 */
      >
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
                ? directoryPickerElement.files[0]
                    .path /* Note: Electron adds a `path` property to File objects, SO Source: https://stackoverflow.com/a/38549837 */
                : undefined;
            if (returnedPath !== undefined) {
              /* Note: this solves a problematic case where triggering Cancel event in the opened window fires off an unintended call to `onInput` and `onChange` with an `undefined` value */
              onInput(returnedPath);
            }
          }}
        />
        <Button
          as="label"
          htmlFor="directory-picker"
          size="massive" /* Note: It is necessary to have `htmlFor` here and point to the <input/> in order to trigger the Filepicker element */
        >
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
