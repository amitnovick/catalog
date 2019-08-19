import React from 'react';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SEMANTIC_BLUE = '#0E6EB8';

const DirectoryIcon = ({ style, ...rest }) => {
  return <FontAwesomeIcon {...rest} icon={faFolder} style={{ ...style, color: SEMANTIC_BLUE }} />;
};

export default DirectoryIcon;
