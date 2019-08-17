import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

const CategoryExists = ({ currentCategory, onClickChangeCategoryButton }) => {
  return (
    <Button size="big" icon labelPosition="right" onClick={() => onClickChangeCategoryButton()}>
      {`Chosen category: ${currentCategory.name}`}
      <Icon name="redo" />
    </Button>
  );
};

CategoryExists.propTypes = {
  currentCategory: PropTypes.object.isRequired,
  onClickChangeCategoryButton: PropTypes.func.isRequired,
};

export default CategoryExists;
