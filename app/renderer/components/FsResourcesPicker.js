import React from 'react';
import PropTypes from 'prop-types';

const { dialog } = require('electron').remote;

const FsResourcesPicker = ({ onChosen, fsResourceType, children }) => {
  const handleDialog = async () => {
    let fsResourceProperty;
    if (fsResourceType === 'file') {
      fsResourceProperty = 'openFile';
    } else if (fsResourceType === 'directory') {
      fsResourceProperty = 'openDirectory';
    } else {
      return;
    }
    const fsResourcesPaths = await dialog.showOpenDialog({
      properties: [fsResourceProperty, 'multiSelections'],
    });
    if (fsResourcesPaths !== undefined) {
      onChosen(fsResourcesPaths);
    }
  };
  return <>{children({ onClick: handleDialog })}</>;
};

FsResourcesPicker.propTypes = {
  onChosen: PropTypes.func.isRequired,
  fsResourceType: PropTypes.oneOf(['file', 'directory']),
  children: PropTypes.func.isRequired,
};

export default FsResourcesPicker;
