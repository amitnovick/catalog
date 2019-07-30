import React from 'react';
import PropTypes from 'prop-types';

import { Modal, Header } from 'semantic-ui-react';

const RenameModalHeader = ({ category }) => {
  return (
    <Modal.Header>
      <Header as="h3" textAlign="center">
        {category === null ? '' : `Rename ${category.name}`}
      </Header>
    </Modal.Header>
  );
};

RenameModalHeader.propTypes = {
  category: PropTypes.object,
};

export default RenameModalHeader;
