import React from 'react';
import PropTypes from 'prop-types';

import { Header, Input, Button } from 'semantic-ui-react';

const CategoryName = ({ category, newCategoryName, onChangeInputText, onClickRenameCategory }) => {
  return (
    <>
      <Input type="text" size="massive">
        <Input value={newCategoryName} onChange={({ target }) => onChangeInputText(target.value)} />
        <Button
          icon="edit"
          size="massive"
          onClick={() => onClickRenameCategory(category, newCategoryName)}
        />
      </Input>
    </>
  );
};

CategoryName.propTypes = {
  category: PropTypes.object.isRequired,
  newCategoryName: PropTypes.string.isRequired,
  onChangeInputText: PropTypes.func.isRequired,
  onClickRenameCategory: PropTypes.func.isRequired,
};

export default CategoryName;
