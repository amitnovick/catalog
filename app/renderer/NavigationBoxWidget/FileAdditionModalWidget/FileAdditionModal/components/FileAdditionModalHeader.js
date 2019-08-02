import React from 'react';

import { Modal, Header } from 'semantic-ui-react';

const FileAdditionModalHeader = () => {
  return (
    <Modal.Header>
      <Header as="h3" textAlign="center">
        Create new file
      </Header>
    </Modal.Header>
  );
};

export default FileAdditionModalHeader;
