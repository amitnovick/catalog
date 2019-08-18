import React from 'react';

import { Modal, Header } from 'semantic-ui-react';

const FsResourcesImportModalHeader = () => {
  return (
    <Modal.Header>
      <Header as="h3" textAlign="center">
        Import Files and Directories
      </Header>
    </Modal.Header>
  );
};

export default FsResourcesImportModalHeader;
