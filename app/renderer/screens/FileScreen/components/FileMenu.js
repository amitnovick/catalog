import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'semantic-ui-react';

const FileMenu = ({ file, onClickOpenFile, onClickDeleteFile }) => {
  return (
    <>
      <br />
      <Button
        title="Open externally with preferred application"
        icon="external"
        size="massive"
        color="green"
        onClick={() => onClickOpenFile(file)}
      />
      <Button
        title="Delete file"
        icon="trash"
        size="massive"
        color="red"
        onClick={() => onClickDeleteFile(file)}
      />
    </>
  );
};

FileMenu.propTypes = {
  file: PropTypes.object.isRequired,
  onClickOpenFile: PropTypes.func.isRequired,
  onClickDeleteFile: PropTypes.func.isRequired,
};

export default FileMenu;
