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
  shouldDisableDeleteCategoryButton,
}) => {
  return (
    <>
      <h2>{`Category: ${category.name}`}</h2>
      <Button
        color="violet"
        as={Link}
        size="big"
        to={`${routes.TREE_EXPLORER}/${category.id}`}
        icon>
        <Icon name="wpexplorer" size="big" />
      </Button>
      <List>
        <List.Item>
          <Input type="text" size="massive">
            <Input
              value={newCategoryName}
              onChange={({ target }) => onChangeNewCategoryName(target.value)}
            />
            <Button
              icon="edit"
              size="massive"
              onClick={() => onClickRenameCategory(category, newCategoryName)}
            />
          </Input>
        </List.Item>
        <List.Item>
          {shouldDisableDeleteCategoryButton ? (
            <Button disabled size="massive" color="red">
              <Icon name="remove" /> Delete category
            </Button>
          ) : (
            <Button size="massive" color="red" onClick={() => onClickDeleteCategory(category)}>
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
  shouldDisableDeleteCategoryButton: PropTypes.bool.isRequired,
};

export default CategoryMenu;
