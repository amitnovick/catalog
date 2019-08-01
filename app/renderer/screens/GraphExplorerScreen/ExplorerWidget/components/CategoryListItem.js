import React from 'react';
import { withRouter } from 'react-router-dom';
import { Icon, Button } from 'semantic-ui-react';
import styled from 'styled-components';

import routes from '../../../../routes';

const StyledListItem = styled.li``;

const StyledDiv = styled.div`
  ${StyledListItem}:hover & {
    background-color: #f0f0f0;
  }
`;

const HoveredButton = styled(Button)`
  visibility: hidden;
  ${StyledListItem}:hover & {
    visibility: visible;
  }
`;

const CategoryListItem = ({
  category,
  onDoubleClickRow,
  onClickRenameButton,
  onClickDeleteButton,
}) => {
  return (
    <StyledListItem>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <StyledDiv
          onDoubleClick={() => onDoubleClickRow('double!')}
          style={{ display: 'inline-block', width: '100%', cursor: 'pointer' }}>
          <Icon name="folder" color="blue" size="big" />
          <span style={{ display: 'inline-block' }}>{category.name}</span>
        </StyledDiv>
        <HoveredButton
          color="grey"
          icon={<Icon name="edit" style={{ color: 'white' }} />}
          onClick={() => onClickRenameButton(category)}
        />

        <HoveredButton
          color="red"
          icon={<Icon name="trash" style={{ color: 'white' }} />}
          onClick={() => onClickDeleteButton(category)}
        />
      </div>
    </StyledListItem>
  );
};

const CategoryListItemWrapper = ({
  category,
  onClickRenameButton,
  onClickDeleteButton,
  history,
}) => {
  return (
    <CategoryListItem
      category={category}
      onClickRenameButton={onClickRenameButton}
      onClickDeleteButton={onClickDeleteButton}
      onDoubleClickRow={() => history.push(`${routes.TREE_EXPLORER}/${category.id}`)}
    />
  );
};

const CategoryListItemWrapperHistoryWrapper = withRouter(CategoryListItemWrapper);

export default CategoryListItemWrapperHistoryWrapper;
