import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport } from '@fortawesome/free-solid-svg-icons';

const FilesImportModalContent = ({ FileImportWidget }) => {
  return (
    <Modal.Content image>
      <div className="image">
        <FontAwesomeIcon
          icon={faFileImport}
          style={{ width: 100, height: 100, color: '#FFD700' }}
        />
      </div>
      <Modal.Description>
        <p>Choose the files to import:</p>
        <FileImportWidget />
      </Modal.Description>
    </Modal.Content>
  );
};

FilesImportModalContent.propTypes = {
  FileImportWidget: PropTypes.any,
};

export default FilesImportModalContent;
