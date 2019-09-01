import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Header, List, Modal as SemanticModal } from 'semantic-ui-react';

import routes from '../../../../routes';
import CategoryIcon from '../../../../components/CategoryIcon';

const Subcategories = ({ subcategories }) => {
  return (
    <SemanticModal.Content image>
      <div className="image">
        <CategoryIcon style={{ width: 150, height: 150 }} />
      </div>
      <SemanticModal.Description>
        <Header>Subcategories:</Header>
        <List>
          {subcategories.map((subcategory) => (
            <li key={subcategory.id}>
              <Link to={`${routes.CATEGORY}/${subcategory.id}`}>{subcategory.name}</Link>
            </li>
          ))}
        </List>
      </SemanticModal.Description>
    </SemanticModal.Content>
  );
};

Subcategories.propTypes = {
  subcategories: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

export default Subcategories;
