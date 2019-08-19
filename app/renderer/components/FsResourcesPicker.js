import React from 'react';
import PropTypes from 'prop-types';
import fsResourceTypes from '../fsResourceTypes';

const { dialog } = require('electron').remote;

const FsResourcesPicker = ({ onChosen, fsResourceType, children }) => {
  const handleDialog = async () => {
    let fsResourceProperty;
    if (fsResourceType === fsResourceTypes.FILE) {
      fsResourceProperty = 'openFile';
    } else if (fsResourceType === fsResourceTypes.DIRECTORY) {
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
  fsResourceType: PropTypes.oneOf([fsResourceTypes.FILE, fsResourceTypes.DIRECTORY]),
  children: PropTypes.func.isRequired,
};

export default FsResourcesPicker;
