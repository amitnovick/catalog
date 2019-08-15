import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import routes from '../../../../routes';
import FileIcon from '../../../../components/FileIcon';

const BLUE = '#2196F3';

const StyledListItem = styled.li`
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
`;

const FileListItem = ({ file, isSelected, onClickRow, onDoubleClickRow }) => {
  return (
    <StyledListItem
      style={{ backgroundColor: isSelected ? BLUE : 'transparent' }}
      onClick={() => (isSelected ? undefined : onClickRow(file))}
      onDoubleClick={() => onDoubleClickRow()}
      title="Open in file screen">
      <FileIcon size="big" style={{ marginRight: '0.5em', marginLeft: '0.2em' }} />
      <span style={{ display: 'inline-block', color: isSelected ? 'white' : 'black' }}>
        {file.name}
      </span>
    </StyledListItem>
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
