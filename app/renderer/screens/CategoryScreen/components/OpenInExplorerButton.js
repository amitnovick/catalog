import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import routes from '../../../routes';

const OpenInExplorerButton = ({ category }) => {
  return (
    <Button color="violet" as={Link} to={`${routes.TREE_EXPLORER}/${category.id}`} size="big" icon>
      <Icon name="wpexplorer" size="big" />
    </Button>
  );
};

OpenInExplorerButton.propTypes = {
  category: PropTypes.object.isRequired,
};

export default OpenInExplorerButton;
