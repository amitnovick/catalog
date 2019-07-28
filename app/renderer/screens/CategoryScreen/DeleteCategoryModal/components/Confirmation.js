import React from 'react';
import PropTypes from 'prop-types';
import { Header, Label } from 'semantic-ui-react';

const Confirmation = ({ category }) => {
  return (
    <>
      <Label size="big">{category.name}</Label>
      <Header as="h2">Are you sure you want to delete this category?</Header>
    </>
  );
};

Confirmation.propTypes = {
  category: PropTypes.object.isRequired,
};

export default Confirmation;
