import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

const NoCategory = ({ onClickChooseCategoryButton }) => {
  return (
    <Button size="big" onClick={() => onClickChooseCategoryButton()}>
      <Icon name="remove circle" />
      No category chosen. Choose category
    </Button>
  );
};

NoCategory.propTypes = {
  onClickChooseCategoryButton: PropTypes.func.isRequired,
};

export default NoCategory;
