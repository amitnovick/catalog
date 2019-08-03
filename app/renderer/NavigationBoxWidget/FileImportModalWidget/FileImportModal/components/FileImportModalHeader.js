import React from 'react';

import { Modal, Header } from 'semantic-ui-react';

const FileImportModalHeader = () => {
  return (
    <Modal.Header>
      <Header as="h3" textAlign="center">
        Import existing files
      </Header>
    </Modal.Header>
  );
};

export default FileImportModalHeader;
