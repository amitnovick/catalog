import React from 'react';
import PropTypes from 'prop-types';
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

const DIRECTORY_PICKER_ELEMENT_ID = 'directory-picker';

const DirectoryPicker = ({ onInput, children }) => {
  return (
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
        id={DIRECTORY_PICKER_ELEMENT_ID}
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
      {children(DIRECTORY_PICKER_ELEMENT_ID)}
    </label>
  );
};

DirectoryPicker.propTypes = {
  onInput: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
};

export default DirectoryPicker;
