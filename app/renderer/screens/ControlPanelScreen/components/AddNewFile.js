import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';

const AddNewFile = ({ onClickAddFile, newFileName, onChangeNewFileName }) => {
  return (
    <Input
      label="File name"
      action={{
        icon: 'file',
        color: 'teal',
        size: 'massive',
        content: 'Add File',
        onClick: () => onClickAddFile(newFileName),
      }}
      size="massive"
      value={newFileName}
      onChange={(event) => onChangeNewFileName(event.target.value)}
    />
  );
};

AddNewFile.propTypes = {
  onClickAddFile: PropTypes.func.isRequired,
  newFileName: PropTypes.string.isRequired,
  onChangeNewFileName: PropTypes.func.isRequired,
};

export default AddNewFile;
