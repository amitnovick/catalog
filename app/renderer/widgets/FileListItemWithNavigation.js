import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import routes from '../routes';
import FileListItem from '../components/FileListItem';

const FileListItemWithHistory = ({ file, history, ...props }) => {
  return (
    <FileListItem
      {...props}
      file={file}
      onDoubleClickRow={() => history.push(`${routes.FILE}/${file.id}`)}
    />
  );
};

const FileListItemWithNavigation = withRouter(FileListItemWithHistory);

FileListItemWithNavigation.propTypes = {
  file: PropTypes.any,
  isSelected: PropTypes.bool.isRequired,
  onClickRow: PropTypes.func.isRequired,
};

export default FileListItemWithNavigation;
