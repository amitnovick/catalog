import React from 'react';
import PropTypes from 'prop-types';

const Categories = ({ categories, onClickCategory }) => {
  return (
    <div style={{ display: 'inline' }}>
      <ul>
        {categories.map((category) => (
          <li key={category.id} style={{ display: 'inline', fontSize: '1.5em', margin: '0.5em' }}>
            <button
              style={{ border: '1px solid black', borderRadius: 5 }}
              onClick={() => onClickCategory(category)}>
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

Categories.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onClickCategory: PropTypes.func.isRequired,
};

export default Categories;
