import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Input, List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import routes from '../../../routes';

const CategoryMenu = ({
  category,
  newCategoryName,
  onChangeNewCategoryName,
  onClickRenameCategory,
  onClickDeleteCategory,
  shouldDisableDeleteCategoryButton
}) => {
  return (
    <>
      <h2>{`Category: ${category.name}`}</h2>
      <Button
        as={Link}
        size="big"
        to={`${routes.TREE_EXPLORER}/${category.id}`}
      >
        <Icon name="sign-in alternate" /> Open in Tree Explorer
      </Button>
      <List>
        <List.Item>
          <Input type="text" size="massive">
            <Input
              value={newCategoryName}
              onChange={({ target }) => onChangeNewCategoryName(target.value)}
            />
            <Button
              size="massive"
              onClick={() => onClickRenameCategory(category, newCategoryName)}
            >
              <Icon name="edit" />
              Rename category
            </Button>
          </Input>
        </List.Item>
        <List.Item>
          {shouldDisableDeleteCategoryButton ? (
            <Button disabled size="massive" color="red">
              <Icon name="remove" /> Delete category
            </Button>
          ) : (
            <Button
              size="massive"
              color="red"
              onClick={() => onClickDeleteCategory(category)}
            >
              <Icon name="remove" /> Delete category
            </Button>
          )}
        </List.Item>
      </List>
    </>
  );
};

CategoryMenu.propTypes = {
  category: PropTypes.object.isRequired,
  newCategoryName: PropTypes.string.isRequired,
  onChangeNewCategoryName: PropTypes.func.isRequired,
  onClickRenameCategory: PropTypes.func.isRequired,
  onClickDeleteCategory: PropTypes.func.isRequired,
  shouldDisableDeleteCategoryButton: PropTypes.bool.isRequired
};

export default CategoryMenu;
