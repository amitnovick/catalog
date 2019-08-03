import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { css } from 'emotion';

/* TODO:
  - This component implements non-trivial tricks that should probably be refactored into an external component entirely, to emphasize that it works only for Electron environment
*/

const wrapperLabelClass = css`
  cursor: pointer;
  display: inline-block;
`;

const inputClass = css`
  display: none;
`;

const AddNewInstance = ({ onInput }) => {
  return (
    <label
      className={
        wrapperLabelClass
      } /* Note: The Default aesthetics where the <input/> displays "No file selected" after being provided a directory is unwanted, therefore this approach hides the <input/> in favor of another styled element (a Button is currently implemented here). Approach found on SO: https://stackoverflow.com/a/43007664 */
    >
      <input
        className={inputClass}
        type="file"
        multiple
        id="files-picker"
        onInput={() => {
          const filesPickerElement = document.getElementById('files-picker');
          if (filesPickerElement && filesPickerElement.files) {
            const files = Array.from(filesPickerElement.files);
            const filesPaths = files.map((file) => file.path);
            /* Note: Electron adds a `path` property to File objects, SO Source: https://stackoverflow.com/a/38549837 */
            if (filesPaths !== []) {
              /* Note: this solves a problematic case where triggering Cancel event in the opened window fires off an unintended call to `onInput` and `onChange` with an `undefined` value */
              onInput(filesPaths);
            }
          }
        }}
      />
      <Button
        as="label"
        htmlFor="files-picker"
        size="massive" /* Note: It is necessary to have `htmlFor` here and point to the <input/> in order to trigger the Filepicker element */
      >
        Choose Files
      </Button>
    </label>
  );
};

AddNewInstance.propTypes = {
  onInput: PropTypes.func.isRequired,
};

export default AddNewInstance;
