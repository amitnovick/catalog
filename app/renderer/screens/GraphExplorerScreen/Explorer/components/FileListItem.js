import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import styled from 'styled-components';

import routes from '../../../../routes';

const StyledListItem = styled.li``;

const StyledDiv = styled.div`
  padding-top: 4px;
  padding-bottom: 4px;

  ${StyledListItem}:hover & {
    background-color: #f0f0f0;
  }
`;

const FileListItem = ({ file, onDoubleClickRow }) => {
  return (
    <StyledListItem>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <StyledDiv
          onDoubleClick={() => onDoubleClickRow('double!')}
          style={{ display: 'inline-block', width: '100%', cursor: 'pointer' }}>
          <Icon name="file" color="yellow" size="big" style={{ marginTop: 2, marginBottom: 2 }} />
          <Link
            title="Open in file screen"
            to={`${routes.FILE}/${file.id}`}
            style={{ display: 'inline-block' }}>
            {file.name}
          </Link>
        </StyledDiv>
      </div>
    </StyledListItem>
  );
};

const FileListItemWrapper = ({ file, history }) => {
  return (
    <FileListItem file={file} onDoubleClickRow={() => history.push(`${routes.FILE}/${file.id}`)} />
  );
};

const FileListItemWrapperHistoryWrapper = withRouter(FileListItemWrapper);

export default FileListItemWrapperHistoryWrapper;
