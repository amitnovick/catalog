import React from 'react';
import { withRouter } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import styled from 'styled-components';

import routes from '../../../../routes';

const StyledListItem = styled.li``;

const StyledDiv = styled.div`
  ${StyledListItem}:hover & {
    background-color: #f0f0f0;
  }
`;

const FileListItem = ({ file, onDoubleClickRow }) => {
  return (
    <StyledListItem style={{ marginTop: 4, marginBottom: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <StyledDiv
          onDoubleClick={() => onDoubleClickRow('double!')}
          style={{ display: 'inline-block', width: '100%', cursor: 'pointer' }}>
          <Icon name="file" color="yellow" size="big" />
          <span style={{ display: 'inline-block' }}>{file.name}</span>
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
