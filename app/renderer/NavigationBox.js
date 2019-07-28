import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import routes from './routes';
import { Menu } from 'semantic-ui-react';

const NavigationBox = ({ path }) => {
  return (
    <Menu size="massive" inverted style={{ backgroundColor: '#073642' /* Solarized base03 */ }}>
      <Menu.Item active={path === routes.HOME} as={Link} to={routes.HOME}>
        Home
      </Menu.Item>
      <Menu.Item active={path === routes.CONTROL_PANEL} as={Link} to={routes.CONTROL_PANEL}>
        Control Panel
      </Menu.Item>
      <Menu.Item active={path === routes.SEARCH} as={Link} to={routes.SEARCH}>
        Search
      </Menu.Item>
      <Menu.Item active={path === routes.TREE_EXPLORER} as={Link} to={routes.TREE_EXPLORER}>
        Tree Explorer
      </Menu.Item>
    </Menu>
  );
};

NavigationBox.propTypes = {
  path: PropTypes.string,
};

export default NavigationBox;
