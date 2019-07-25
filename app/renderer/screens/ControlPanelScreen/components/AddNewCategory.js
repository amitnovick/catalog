import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';

const AddNewCategory = ({ onClickAddCategory, newCategoryName, onChangeNewCategoryName }) => {
  return (
    <Input
      label={{ content: 'Category name', icon: 'folder' }}
      action={{
        icon: 'add',
        color: 'blue',
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
