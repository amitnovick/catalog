import React from 'react';
import { css } from 'emotion';
import { Link } from 'react-router-dom';
import routes from './routes';

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

const NavigationBox = () => {
  return (
    <ul
      className={css({
        display: 'flex',
        flexDirection: 'row',
        listStyle: 'none',
        padding: 5,
      })}>
      <li className={listItemClass}>
        <Link to={routes.HOME} className={linkClass}>
          Home
        </Link>
      </li>
      <li className={listItemClass}>
        <Link to={routes.CONTROL_PANEL} className={linkClass}>
          Control Panel
        </Link>
      </li>
      <li className={listItemClass}>
        <Link to={routes.SEARCH} className={linkClass}>
          Search
        </Link>
      </li>
      <li className={listItemClass}>
        <Link to={routes.TREE_EXPLORER} className={linkClass}>
          Tree Explorer
        </Link>
      </li>
    </ul>
  );
};

export default NavigationBox;
