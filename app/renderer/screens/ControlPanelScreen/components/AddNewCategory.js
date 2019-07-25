import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Input } from 'semantic-ui-react';

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

const AddNewCategory = ({ onClickAddCategory, newCategoryName, onChangeNewCategoryName }) => {
  return (
    <Input
      label="Category name"
      action={{
        icon: 'folder',
        color: 'teal',
        size: 'massive',
        content: 'Add Category',
        onClick: () => onClickAddCategory(newCategoryName),
      }}
      size="massive"
      value={newCategoryName}
      onChange={(event) => onChangeNewCategoryName(event.target.value)}
    />
  );
};

AddNewCategory.propTypes = {
  onClickAddCategory: PropTypes.func.isRequired,
  newCategoryName: PropTypes.string.isRequired,
  onChangeNewCategoryName: PropTypes.func.isRequired,
};

export default AddNewCategory;
