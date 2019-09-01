import React from 'react';
import PropTypes from 'prop-types';
import { Header, Label, Modal as SemanticModal } from 'semantic-ui-react';
import CategoryIcon from '../../../../components/CategoryIcon';

const Confirmation = ({ category }) => {
  return (
    <SemanticModal.Content image>
      <div className="image">
        <CategoryIcon style={{ width: 150, height: 150 }} />
      </div>
      <SemanticModal.Description>
        <Label size="big">{category.name}</Label>
        <Header as="h2">Are you sure you want to delete this category?</Header>
      </SemanticModal.Description>
    </SemanticModal.Content>
  );
};

Confirmation.propTypes = {
  category: PropTypes.object.isRequired,
};

export default Confirmation;
