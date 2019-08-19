import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { css } from 'emotion';

import routes from '../../../../routes';
import CategoryIcon from '../../../../components/CategoryIcon';

const BLUE = '#2196F3';

const liClass = css`
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
`;

const CategoryListItem = ({ category, isSelected, onClickRow, onDoubleClickRow }) => {
  return (
    <li
      className={liClass}
      style={{ backgroundColor: isSelected ? BLUE : 'transparent' }}
      onClick={() => (isSelected ? undefined : onClickRow(category))}
      onDoubleClick={() => onDoubleClickRow()}
      onMouseDown={(event) => event.preventDefault()}
      title="Navigate to category">
      <CategoryIcon
        color={isSelected ? 'white' : 'black'}
        size="lg"
        style={{ marginRight: '0.5em', marginLeft: '0.2em' }}
      />
      <span
        style={{
          display: 'inline-block',
          color: isSelected ? 'white' : 'black',
        }}>
        {category.name}
      </span>
    </li>
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