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
      <List>
        <List.Item>
          <h2>{`Category: ${category.name}`}</h2>
        </List.Item>
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
      </List>
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
  newCategoryName: PropTypes.string.isRequired,
  onChangeNewCategoryName: PropTypes.func.isRequired,
  onClickRenameCategory: PropTypes.func.isRequired,
  onClickDeleteCategory: PropTypes.func.isRequired,
  shouldDisableDeleteCategoryButton: PropTypes.bool.isRequired,
};

export default CategoryMenu;
