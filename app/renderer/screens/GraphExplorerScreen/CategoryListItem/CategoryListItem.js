import React from 'react';
import { Link } from 'react-router-dom';
import { List, Icon } from 'semantic-ui-react';

import routes from '../../../routes';

const threeDotsCss = {
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  display: 'inline-block',
  width: '100%',
};

const CategoryListItem = ({ category }) => {
  return (
    <List.Item as={Link} to={`${routes.TREE_EXPLORER}/${category.id}`}>
      <Icon name="folder" color="blue" size="large" />
      <List.Content>
        <List.Header style={threeDotsCss}>{category.name}</List.Header>
      </List.Content>
    </List.Item>
  );
};

export default CategoryListItem;
