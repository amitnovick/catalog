import React from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';

const BroaderCategoriesModal = ({
  isOpen,
  onClose,
  broaderCategories,
  onClickYes
}) => {
  return (
    <Modal open={isOpen} closeIcon dimmer onClose={onClose}>
      <Header icon="archive" content="Delete Existing Broader Categories?" />
      <Modal.Content>
        <p>Broader Categories:</p>
        <ul>
          {broaderCategories.map(broaderCategory => (
            <li key={broaderCategory.id}>{broaderCategory.name}</li>
          ))}
        </ul>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={onClose}>
          <Icon name="remove" /> No
        </Button>
        <Button color="green" onClick={onClickYes}>
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

BroaderCategoriesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  broaderCategories: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onClickYes: PropTypes.func.isRequired
};

export default BroaderCategoriesModal;
