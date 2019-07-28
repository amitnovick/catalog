import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import routes from '../../../routes';

const CategoryMenu = ({ category, onClickDeleteCategory, shouldDisableDeleteCategoryButton }) => {
  return (
    <>
      <Button
        color="violet"
        as={Link}
        to={`${routes.TREE_EXPLORER}/${category.id}`}
        size="big"
        icon>
        <Icon name="wpexplorer" size="big" />
      </Button>
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
    </>
  );
};

CategoryMenu.propTypes = {
  category: PropTypes.object.isRequired,
  onClickDeleteCategory: PropTypes.func.isRequired,
  shouldDisableDeleteCategoryButton: PropTypes.bool.isRequired,
};

export default CategoryMenu;
