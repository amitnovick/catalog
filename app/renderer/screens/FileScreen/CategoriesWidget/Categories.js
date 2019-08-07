import React from 'react';
import PropTypes from 'prop-types';
import { Label, Header } from 'semantic-ui-react';
import CategoryIcon from '../../../components/CategoryIcon';

const Categories = ({ categories, onClickCategory }) => {
  return (
    <>
      <Header as="h2">
        <CategoryIcon style={{ marginRight: '0.5em' }} />
        <Header.Content>Associated Categories</Header.Content>
      </Header>
      <Label.Group color="blue" size="big">
        {categories.map((category) => (
          <Label
            title="More actions"
            key={category.id}
            style={{ cursor: 'pointer' }}
            onClick={() => onClickCategory(category)}>
            {category.name}
          </Label>
        ))}
      </Label.Group>
    </>
  );
};

Categories.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onClickCategory: PropTypes.func.isRequired,
};

export default Categories;
