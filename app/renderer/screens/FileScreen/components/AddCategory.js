import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';

const AddCategory = ({
  file,
  parentCategoryName,
  onChangeParentCategoryName,
  onClickAddCategory
}) => {
  return (
    <div>
      <h2>Add category</h2>
      <Input
        type="text"
        value={parentCategoryName}
        onChange={event => onChangeParentCategoryName(event.target.value)}
      />
      <button onClick={() => onClickAddCategory(file, parentCategoryName)}>
        +
      </button>
    </div>
  );
};

AddCategory.propTypes = {
  file: PropTypes.object.isRequired,
  parentCategoryName: PropTypes.string.isRequired,
  onChangeParentCategoryName: PropTypes.func.isRequired,
  onClickAddCategory: PropTypes.func.isRequired
};

export default AddCategory;
