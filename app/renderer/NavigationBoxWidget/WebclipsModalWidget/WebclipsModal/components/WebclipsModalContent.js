import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';

const WebclipsModalContent = ({ Content }) => {
  return (
    <Modal.Content image>
      <div className="image">
        <FontAwesomeIcon icon={faPaperclip} style={{ width: 100, height: 100 }} />
      </div>
      <Modal.Description>
        <Header>
          When a category is chosen, new webclips are automatically assigned with it as an initial
          category
        </Header>
        <Content />
      </Modal.Description>
    </Modal.Content>
  );
};

WebclipsModalContent.propTypes = {
  Content: PropTypes.func.isRequired,
};

export default WebclipsModalContent;
