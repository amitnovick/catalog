import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Header } from 'semantic-ui-react';

import routes from '../../../../routes';

const Subcategories = ({ subcategories }) => {
  return (
    <>
      <Header>Subcategories:</Header>
      <ul>
        {subcategories.map((subcategory) => (
          <li key={subcategory.id}>
            <Link to={`${routes.CATEGORY}/${subcategory.id}`}>{subcategory.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

Subcategories.propTypes = {
  subcategories: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

export default Subcategories;
