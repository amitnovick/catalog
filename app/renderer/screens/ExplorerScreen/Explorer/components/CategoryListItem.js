import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { css } from 'emotion';

import routes from '../../../../routes';
import CategoryIcon from '../../../../components/CategoryIcon';

const BLUE = '#2196F3';

const ICON_SIZE_PX = 30;

const liClass = css`
  padding-top: 8px;
  padding-bottom: 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
  height: 50px;
`;

const spanClass = css`
  display: inline-block;
  font-size: ${ICON_SIZE_PX - 6}px;
  line-height: ${ICON_SIZE_PX - 6}px;
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
        style={{
          width: ICON_SIZE_PX,
          height: ICON_SIZE_PX,
          marginRight: '0.5em',
          marginLeft: '0.2em',
        }}
      />
      <span
        className={spanClass}
        style={{
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
