import React from 'react';
import PropTypes from 'prop-types';

import DirectoryIcon from './DirectoryIcon';
import FileIcon from './FileIcon';
import fsResourceTypes from '../fsResourceTypes';

const iconStyle = { marginRight: '0.5em', marginLeft: '0.2em' };

const FsResourceIcon = ({ fsResourceType }) => {
  if (fsResourceType === fsResourceTypes.FILE) {
    return <FileIcon size="lg" style={iconStyle} />;
  } else if (fsResourceType === fsResourceTypes.DIRECTORY) {
    return <DirectoryIcon size="lg" style={iconStyle} />;
  }
};

FsResourceIcon.propTypes = {
  fsResourceType: PropTypes.oneOf([fsResourceTypes.FILE, fsResourceTypes.DIRECTORY]).isRequired,
};

export default FsResourceIcon;
