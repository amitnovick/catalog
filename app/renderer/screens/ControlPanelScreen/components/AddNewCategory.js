import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

const buttonClass = css`
  margin: 5px;
  cursor: pointer;
  background-color: white;
  font-weight: bold;
  font-size: 2em;
  padding: 5px;
  border: 2px solid black;
`;

const formClass = css`
  margin: 5px;
  font-size: 2em;
`;

const AddNewCategory = ({
  onClickAddCategory,
  newCategoryName,
  onChangeNewCategoryName
}) => {
  return (
    <div>
      <label htmlFor="category-name-input" className={formClass}>
        Category name:
      </label>
      <input
        id="category-name-input"
        className={formClass}
        value={newCategoryName}
        onChange={event => onChangeNewCategoryName(event.target.value)}
      />
      <button
        type="button"
        className={buttonClass}
        onClick={() => onClickAddCategory(newCategoryName)}
      >
        +
      </button>
    </div>
  );
};

AddNewCategory.propTypes = {
  onClickAddCategory: PropTypes.func.isRequired,
  newCategoryName: PropTypes.string.isRequired,
  onChangeNewCategoryName: PropTypes.func.isRequired
};

export default AddNewCategory;
