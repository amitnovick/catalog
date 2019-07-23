import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Header } from 'semantic-ui-react';

import routes from '../../../../routes';

const CategorizedFiles = ({ categorizedFiles }) => {
  return (
    <>
      <Header>Categorized Files:</Header>
      <ul>
        {categorizedFiles.map(categorizedFile => (
          <li key={categorizedFile.id}>
            <Link to={`${routes.FILE}/${categorizedFile.id}`}>
              {categorizedFile.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

CategorizedFiles.propTypes = {
  categorizedFiles: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired
};

export default CategorizedFiles;
