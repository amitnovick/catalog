import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Link } from 'react-router-dom';
import routes from './routes';
import { Menu } from 'semantic-ui-react';

const linkClass = css({
  fontSize: 20,
  fontFamily: 'helvetica',
  textDecoration: 'none',
  color: 'black',
});

const listItemClass = css({
  margin: 5,
  border: '1px solid black',
  borderRadius: 5,
  padding: '2px 6px',
  ':hover': {
    backgroundColor: '#f0f0f0',
  },
});

const NavigationBox = ({ path }) => {
  return (
    <Menu size="massive">
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
