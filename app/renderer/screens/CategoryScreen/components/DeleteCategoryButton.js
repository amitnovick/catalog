import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

const DeleteCategoryButton = ({
  category,
  onClickDeleteCategory,
  shouldDisableDeleteCategoryButton,
}) => {
  return (
    <Button
      onClick={
        shouldDisableDeleteCategoryButton ? undefined : () => onClickDeleteCategory(category)
      }
      disabled={shouldDisableDeleteCategoryButton}
      size="big"
      color="red"
      icon>
      <Icon name="trash" size="big" />
    </Button>
  );
};

DeleteCategoryButton.propTypes = {
  category: PropTypes.object.isRequired,
  onClickDeleteCategory: PropTypes.func.isRequired,
  shouldDisableDeleteCategoryButton: PropTypes.bool.isRequired,
};

export default DeleteCategoryButton;
