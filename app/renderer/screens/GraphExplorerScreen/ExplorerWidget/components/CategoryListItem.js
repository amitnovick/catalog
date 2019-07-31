import React from 'react';
import { withRouter } from 'react-router-dom';
import { List, Icon, Button } from 'semantic-ui-react';
import styled from 'styled-components';

import routes from '../../../../routes';

const StyledListItem = styled(List.Item)``;

const StyledDiv = styled.div`
  ${StyledListItem}:hover & {
    background-color: #f0f0f0;
  }
`;

const RenameButton = styled(Button)`
  display: none !important;
  ${StyledListItem}:hover & {
    display: inline-block !important;
  }
`;

const CategoryListItem = ({ category, onDoubleClickRow, onClickRenameButton }) => {
  return (
    <StyledListItem>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <StyledDiv
          onDoubleClick={() => onDoubleClickRow('double!')}
          style={{ display: 'inline-block', width: '100%', cursor: 'pointer' }}>
          <Icon name="folder" color="blue" size="big" />
          <List.Content style={{ display: 'inline-block' }}>{category.name}</List.Content>
        </StyledDiv>
        <RenameButton
          color="grey"
          icon={<Icon name="edit" style={{ color: 'white' }} />}
          onClick={() => onClickRenameButton(category)}
        />
      </div>
    </StyledListItem>
  );
};

const CategoryListItemWrapper = ({ category, onClickRenameButton, history }) => {
  return (
    <CategoryListItem
      category={category}
      onClickRenameButton={onClickRenameButton}
      onDoubleClickRow={() => history.push(`${routes.TREE_EXPLORER}/${category.id}`)}
    />
  );
};

const CategoryListItemWrapperHistoryWrapper = withRouter(CategoryListItemWrapper);

export default CategoryListItemWrapperHistoryWrapper;
