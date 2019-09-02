import React from 'react';
import PropTypes from 'prop-types';
import { Message, List } from 'semantic-ui-react';

import CategoryListItem from './CategoryListItem';

const CategoryList = ({ categories, hasSelectedRow, selectedCategoryRow, onClickRow }) => {
  return (
    <List size="big" style={{ padding: categories.length === 0 ? '0.5em' : 0 }}>
      {categories.length > 0 ? (
        categories.map((childCategory) => (
          <CategoryListItem
            category={childCategory}
            isSelected={
              hasSelectedRow &&
              selectedCategoryRow !== null &&
              selectedCategoryRow.id === childCategory.id
            }
            key={childCategory.id}
            onClickRow={onClickRow}
          />
        ))
      ) : (
        <List.Item>
          <Message info>
            <Message.Header>No Categories</Message.Header>
          </Message>
        </List.Item>
      )}
    </List>
  );
};

CategoryList.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  hasSelectedRow: PropTypes.bool.isRequired,
  selectedCategoryRow: PropTypes.object,
  onClickRow: PropTypes.func.isRequired,
};

export default CategoryList;
