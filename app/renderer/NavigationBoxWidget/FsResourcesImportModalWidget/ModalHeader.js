import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport } from '@fortawesome/free-solid-svg-icons';
import { Modal, Header } from 'semantic-ui-react';
import { css } from 'emotion';

const headerClass = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalHeader = () => {
  return (
    <Modal.Header>
      <Header as="h3" className={headerClass}>
        <FontAwesomeIcon
          icon={faFileImport}
          style={{ width: 32, height: 32, marginRight: '1em' }}
        />
        Import Files and Directories
      </Header>
    </Modal.Header>
  );
};

export default ModalHeader;
