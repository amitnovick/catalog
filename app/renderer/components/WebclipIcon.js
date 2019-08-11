import React from 'react';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const WebclipIcon = (props) => {
  return <FontAwesomeIcon {...props} icon={faPaperclip} />;
};

export default WebclipIcon;
