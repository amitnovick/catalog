import React from 'react';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SEMANTIC_YELLOW = '#fbbd08';

const FileIcon = ({ style, ...rest }) => {
  return <FontAwesomeIcon {...rest} icon={faFile} style={{ ...style, color: SEMANTIC_YELLOW }} />;
};

export default FileIcon;
