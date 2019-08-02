import React from 'react';

import { Modal, Header } from 'semantic-ui-react';

const AdditionModalHeader = () => {
  return (
    <Modal.Header>
      <Header as="h3" textAlign="center">
        Create a new category
      </Header>
    </Modal.Header>
  );
};

export default AdditionModalHeader;
