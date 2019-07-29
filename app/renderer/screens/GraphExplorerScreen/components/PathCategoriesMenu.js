import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import routes from '../../../routes';

const PathCategoriesMenu = ({ categoriesInPath }) => {
  return (
    <Menu secondary>
      {categoriesInPath.map((categoryInPath, categoryIndex) => (
        <Menu.Item
          key={categoryInPath.id}
          as={Link}
          to={`${routes.TREE_EXPLORER}/${categoryInPath.id}`}
          active={categoryIndex === categoriesInPath.length - 1}>
          {categoryInPath.name}
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default PathCategoriesMenu;
