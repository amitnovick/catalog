import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Header, List, Modal as SemanticModal } from 'semantic-ui-react';

import routes from '../../../../routes';
import CategoryIcon from '../../../../components/CategoryIcon';

const CategorizedFiles = ({ categorizedFiles }) => {
  return (
    <SemanticModal.Content image>
      <div className="image">
        <CategoryIcon size="10x" />
      </div>
      <SemanticModal.Description>
        <Header>Categorized Files:</Header>
        <List>
          {categorizedFiles.map((categorizedFile) => (
            <li key={categorizedFile.id}>
              <Link to={`${routes.FILE}/${categorizedFile.id}`}>{categorizedFile.name}</Link>
            </li>
          ))}
        </List>
      </SemanticModal.Description>
    </SemanticModal.Content>
  );
};

CategorizedFiles.propTypes = {
  categorizedFiles: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

export default CategorizedFiles;
