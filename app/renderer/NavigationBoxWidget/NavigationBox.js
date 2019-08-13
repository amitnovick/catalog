import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import routes from '../routes';
import { Menu, Icon, Button } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport } from '@fortawesome/free-solid-svg-icons';

const NavigationBox = ({ path, onClickAddButton, onClickFileImportButton }) => {
  return (
    <Menu size="massive" inverted style={{ backgroundColor: '#073642' /* Solarized base03 */ }}>
      <Menu.Item
        style={{ marginRight: 30 }}
        active={path === routes.HOME}
        as={Link}
        to={routes.HOME}>
        <Icon name="home" size="big" />
      </Menu.Item>
      <Menu.Item as={Button} onClick={() => onClickFileImportButton()}>
        <FontAwesomeIcon icon={faFileImport} size="2x" />
      </Menu.Item>
      <Menu.Item style={{ marginRight: 30 }} as={Button} onClick={() => onClickAddButton()}>
        <Icon name="add" size="big" />
      </Menu.Item>
      <Menu.Item active={path === routes.SEARCH} as={Link} to={routes.SEARCH}>
        <Icon name="search" size="big" />
      </Menu.Item>
      <Menu.Item active={path === routes.TREE_EXPLORER} as={Link} to={routes.TREE_EXPLORER}>
        <Icon name="wpexplorer" size="big" />
      </Menu.Item>
      <Menu.Item
        active={path === routes.RESOURCES_ADDITION_TIMELINE}
        as={Link}
        to={routes.RESOURCES_ADDITION_TIMELINE}>
        <Icon name="calendar times outline" size="big" />
      </Menu.Item>
    </Menu>
  );
};

NavigationBox.propTypes = {
  path: PropTypes.string,
  onClickAddButton: PropTypes.func.isRequired,
  onClickFileImportButton: PropTypes.func.isRequired,
};

export default NavigationBox;
