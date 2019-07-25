import React from 'react';
import PropTypes from 'prop-types';
import { Input, Header } from 'semantic-ui-react';

const AddCategory = ({
  file,
  parentCategoryName,
  onChangeParentCategoryName,
  onClickAddCategory,
}) => {
  return (
    <div>
      <Header as="h2">Assign Category</Header>
      <Input
        label={{ content: 'Category name', icon: 'folder' }}
        action={{
          icon: 'add',
          color: 'blue',
          size: 'massive',
          content: 'Assign',
          onClick: () => onClickAddCategory(file, parentCategoryName),
        }}
        size="massive"
        value={parentCategoryName}
        onChange={(event) => onChangeParentCategoryName(event.target.value)}
      />
    </div>
  );
};

AddCategory.propTypes = {
  file: PropTypes.object.isRequired,
  parentCategoryName: PropTypes.string.isRequired,
  onChangeParentCategoryName: PropTypes.func.isRequired,
  onClickAddCategory: PropTypes.func.isRequired,
};

export default AddCategory;
