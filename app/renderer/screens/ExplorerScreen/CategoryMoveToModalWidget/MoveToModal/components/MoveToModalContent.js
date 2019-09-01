import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header } from 'semantic-ui-react';
import CategoryIcon from '../../../../../components/CategoryIcon';

const MoveToModalContent = ({ ModalContent }) => {
  return (
    <Modal.Content image>
      <div className="image">
        <CategoryIcon style={{ width: 150, height: 150 }} />
      </div>
      <Modal.Description>
        <Header>Choose the category to move to:</Header>
        {ModalContent !== undefined ? <ModalContent /> : null}
      </Modal.Description>
    </Modal.Content>
  );
};

MoveToModalContent.propTypes = {
  ModalContent: PropTypes.any,
};

export default MoveToModalContent;
