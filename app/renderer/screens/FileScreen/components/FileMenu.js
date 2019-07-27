import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'semantic-ui-react';

const FileMenu = ({ file, onClickOpenFile, onClickDeleteFile }) => {
  return (
    <>
      <br />
      <Button
        icon="envelope open"
        size="massive"
        color="green"
        onClick={() => onClickOpenFile(file)}
      />
      <Button icon="trash" size="massive" color="red" onClick={() => onClickDeleteFile(file)} />
    </>
  );
};

FileMenu.propTypes = {
  file: PropTypes.object.isRequired,
  onClickOpenFile: PropTypes.func.isRequired,
  onClickDeleteFile: PropTypes.func.isRequired,
};

export default FileMenu;
