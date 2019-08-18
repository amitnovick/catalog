import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';

const DirectoriesImportModalContent = ({ DirectoriesImportWidget }) => {
  return (
    <Modal.Content image>
      <div className="image">
        <FontAwesomeIcon icon={faFolder} style={{ width: 100, height: 100, color: '#0E6EB8' }} />
      </div>
      <Modal.Description>
        <Header>Choose the directories to import:</Header>
        <DirectoriesImportWidget />
      </Modal.Description>
    </Modal.Content>
  );
};

DirectoriesImportModalContent.propTypes = {
  DirectoriesImportWidget: PropTypes.any,
};

export default DirectoriesImportModalContent;
