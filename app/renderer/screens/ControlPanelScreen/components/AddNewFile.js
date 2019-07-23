import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Input } from 'semantic-ui-react';

const buttonClass = css`
  margin: 5px;
  cursor: pointer;
  background-color: white;
  font-weight: bold;
  font-size: 2em;
  padding: 5px;
  border: 2px solid black;
`;

const formClass = css`
  margin: 5px;
  font-size: 2em;
`;

const AddNewFile = ({ onClickAddFile, newFileName, onChangeNewFileName }) => {
  return (
    <div>
      <label htmlFor="file-name-input" className={formClass}>
        File name:
      </label>
      <Input
        id="file-name-input"
        className={formClass}
        value={newFileName}
        onChange={event => onChangeNewFileName(event.target.value)}
      />
      <button
        type="button"
        className={buttonClass}
        onClick={() => onClickAddFile(newFileName)}
      >
        +
      </button>
    </div>
  );
};

AddNewFile.propTypes = {
  onClickAddFile: PropTypes.func.isRequired,
  newFileName: PropTypes.string.isRequired,
  onChangeNewFileName: PropTypes.func.isRequired
};

export default AddNewFile;
