import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import styled from 'styled-components';

import routes from '../../../../routes';
import CategoryIcon from '../../../../components/CategoryIcon';

const BLUE = '#2196F3';

const StyledListItem = styled.li``;

const StyledDiv = styled.div`
  padding-top: 4px;
  padding-bottom: 4px;

  /* ${StyledListItem}:hover & {
    background-color: #f0f0f0;
  } */
`;

const CategoryListItem = ({ category, isSelected, onClickRow, onDoubleClickRow }) => {
  return (
    <StyledListItem
      style={{ backgroundColor: isSelected ? BLUE : 'transparent' }}
      onClick={() => (isSelected ? undefined : onClickRow(category))}
      onDoubleClick={() => onDoubleClickRow()}
      title="Navigate to category">
      <StyledDiv style={{ display: 'inline-block', width: '100%', cursor: 'pointer' }}>
        <CategoryIcon
          color={isSelected ? 'white' : 'black'}
          size="lg"
          style={{ marginRight: '0.5em', marginLeft: '0.2em', marginTop: 2, marginBottom: 2 }}
        />
        <span style={{ display: 'inline-block', color: isSelected ? 'white' : 'black' }}>
          {category.name}
        </span>
      </StyledDiv>
    </StyledListItem>
  );
};

const CategoryListItemWrapper = ({ category, isSelected, onClickRow, history }) => {
  return (
    <CategoryListItem
      category={category}
      isSelected={isSelected}
      onClickRow={onClickRow}
      onDoubleClickRow={() => history.push(`${routes.TREE_EXPLORER}/${category.id}`)}
    />
  );
};

const CategoryListItemWrapperHistoryWrapper = withRouter(CategoryListItemWrapper);

CategoryListItemWrapperHistoryWrapper.propTypes = {
  category: PropTypes.any,
  isSelected: PropTypes.bool.isRequired,
  onClickRow: PropTypes.func.isRequired,
};

export default CategoryListItemWrapperHistoryWrapper;
