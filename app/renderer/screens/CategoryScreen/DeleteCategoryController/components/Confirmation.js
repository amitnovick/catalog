import React from 'react';
import PropTypes from 'prop-types';
import { Header, Button, Icon } from 'semantic-ui-react';

const Confirmation = ({ category, onConfirmDelete, onCancelDelete }) => {
  return (
    <>
      <Header as="h1">{category.name}</Header>
      <Header as="h2">Are you sure you want to delete this category?</Header>
      <Button color="green" onClick={onCancelDelete}>
        Cancel
      </Button>
      <Button color="red" onClick={onConfirmDelete}>
        <Icon name="remove" /> Delete Category
      </Button>
    </>
  );
};

Confirmation.propTypes = {
  category: PropTypes.object.isRequired,
  onConfirmDelete: PropTypes.func.isRequired,
  onCancelDelete: PropTypes.func.isRequired
};

export default Confirmation;
