import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { Icon, Button } from 'semantic-ui-react';

import styled from 'styled-components';

import routes from '../../../../routes';
import CategoryIcon from '../../../../components/CategoryIcon';

const StyledListItem = styled.li``;

const StyledDiv = styled.div`
  padding-top: 4px;
  padding-bottom: 4px;

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
  onClickMoveToButton,
  onClickDeleteButton,
}) => {
  return (
    <StyledListItem>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <StyledDiv
          onDoubleClick={() => onDoubleClickRow('double!')}
          style={{ display: 'inline-block', width: '100%', cursor: 'pointer' }}>
          <CategoryIcon size="lg" style={{ marginRight: '0.5em', marginTop: 2, marginBottom: 2 }} />
          <Link
            title="Navigate to category"
            to={`${routes.TREE_EXPLORER}/${category.id}`}
            style={{ display: 'inline-block' }}>
            {category.name}
          </Link>
        </StyledDiv>
        <HoveredButton
          color="grey"
          title="Rename category"
          icon={<Icon name="edit" style={{ color: 'white' }} />}
          onClick={() => onClickRenameButton(category)}
        />
        <HoveredButton
          color="teal"
          title="Move to"
          icon={<Icon name="arrow circle right" style={{ color: 'white' }} />}
          onClick={() => onClickMoveToButton(category)}
        />
        <HoveredButton
          color="red"
          title="Delete category"
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
  onClickMoveToButton,
  onClickDeleteButton,
  history,
}) => {
  return (
    <CategoryListItem
      category={category}
      onClickRenameButton={onClickRenameButton}
      onClickDeleteButton={onClickDeleteButton}
      onClickMoveToButton={onClickMoveToButton}
      onDoubleClickRow={() => history.push(`${routes.TREE_EXPLORER}/${category.id}`)}
    />
  );
};

const CategoryListItemWrapperHistoryWrapper = withRouter(CategoryListItemWrapper);

CategoryListItemWrapperHistoryWrapper.propTypes = {
  category: PropTypes.any,
  onClickRenameButton: PropTypes.func.isRequired,
  onClickMoveToButton: PropTypes.func.isRequired,
  onClickDeleteButton: PropTypes.func.isRequired,
};

export default CategoryListItemWrapperHistoryWrapper;
