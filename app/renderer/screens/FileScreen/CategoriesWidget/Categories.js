import React from 'react';
import PropTypes from 'prop-types';
import { Label } from 'semantic-ui-react';

const Categories = ({ categories, onClickCategory }) => {
  return (
    <Label.Group color="blue" size="big">
      {categories.map((category) => (
        <Label
          key={category.id}
          style={{ cursor: 'pointer' }}
          onClick={() => onClickCategory(category)}>
          {category.name}
        </Label>
      ))}
    </Label.Group>
  );
};

Categories.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onClickCategory: PropTypes.func.isRequired,
};

export default Categories;
