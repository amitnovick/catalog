import React from 'react';
import PropTypes from 'prop-types';

import { Modal, Header } from 'semantic-ui-react';

const MoveToModalHeader = ({ category }) => {
  return (
    <Modal.Header>
      <Header as="h3" textAlign="center">
        {category === null ? '' : `Move "${category.name}"`}
      </Header>
    </Modal.Header>
  );
};

MoveToModalHeader.propTypes = {
  category: PropTypes.object,
};

export default MoveToModalHeader;
