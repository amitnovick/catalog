import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import routes from './routes';
import { Menu, Icon } from 'semantic-ui-react';

const NavigationBox = ({ path }) => {
  return (
    <Menu size="massive" inverted style={{ backgroundColor: '#073642' /* Solarized base03 */ }}>
      <Menu.Item active={path === routes.HOME} as={Link} to={routes.HOME}>
        <Icon name="home" size="big" />
      </Menu.Item>
      <Menu.Item active={path === routes.CONTROL_PANEL} as={Link} to={routes.CONTROL_PANEL}>
        <Icon name="add" size="big" />
      </Menu.Item>
      <Menu.Item active={path === routes.SEARCH} as={Link} to={routes.SEARCH}>
        <Icon name="search" size="big" />
      </Menu.Item>
      <Menu.Item active={path === routes.TREE_EXPLORER} as={Link} to={routes.TREE_EXPLORER}>
        <Icon name="wpexplorer" size="big" />
      </Menu.Item>
    </Menu>
  );
};

NavigationBox.propTypes = {
  path: PropTypes.string,
};

export default NavigationBox;
