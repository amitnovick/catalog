import React from 'react';
import PropTypes from 'prop-types';
import { Label, Icon } from 'semantic-ui-react';

const Categories = ({ categories, onClickCategory }) => {
  return (
    <Label.Group tag color="blue" size="big">
      {categories.map((category) => (
        <Label key={category.id}>
          {category.name}
          <Icon name="question" onClick={() => onClickCategory(category)} />
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
