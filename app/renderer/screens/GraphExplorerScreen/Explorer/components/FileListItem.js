import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { css } from 'emotion';

import routes from '../../../../routes';
import FileIcon from '../../../../components/FileIcon';

const BLUE = '#2196F3';

const liClass = css`
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
`;

const FileListItem = ({ file, isSelected, onClickRow, onDoubleClickRow }) => {
  return (
    <li
      className={liClass}
      style={{ backgroundColor: isSelected ? BLUE : 'transparent' }}
      onClick={() => (isSelected ? undefined : onClickRow(file))}
      onDoubleClick={() => onDoubleClickRow()}
      title="Open in file screen">
      <FileIcon size="lg" style={{ marginRight: '0.5em', marginLeft: '0.2em' }} />
      <span style={{ display: 'inline-block', color: isSelected ? 'white' : 'black' }}>
        {file.name}
      </span>
    </li>
  );
};

const FileListItemWrapper = ({ file, history, ...props }) => {
  return (
    <FileListItem
      {...props}
      file={file}
      onDoubleClickRow={() => history.push(`${routes.FILE}/${file.id}`)}
    />
  );
};

const FileListItemWrapperHistoryWrapper = withRouter(FileListItemWrapper);

FileListItemWrapperHistoryWrapper.propTypes = {
  file: PropTypes.any,
  isSelected: PropTypes.bool.isRequired,
  onClickRow: PropTypes.func.isRequired,
};

export default FileListItemWrapperHistoryWrapper;
