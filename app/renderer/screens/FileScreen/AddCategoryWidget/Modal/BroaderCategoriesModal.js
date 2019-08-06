import React from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Modal as SemanticModal, List } from 'semantic-ui-react';
import Modal from '../../../../components/Modal';

const BroaderCategoriesModal = ({ onClose, broaderCategories, onClickYes }) => {
  return (
    <Modal
      onClose={onClose}
      ModalHeader={
        <SemanticModal.Header>
          <Header as="h3" textAlign="center">
            Dissociate existing Broader Categories
          </Header>
        </SemanticModal.Header>
      }
      ModalContent={
        <SemanticModal.Content>
          <Header as="h3">Broader Categories:</Header>
          <List>
            {broaderCategories.map((broaderCategory) => (
              <li key={broaderCategory.id}>{broaderCategory.name}</li>
            ))}
          </List>
        </SemanticModal.Content>
      }
      ModalActions={
        <SemanticModal.Actions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onClickYes}>Dissociate</Button>
        </SemanticModal.Actions>
      }
    />
  );
};

BroaderCategoriesModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  broaderCategories: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onClickYes: PropTypes.func.isRequired,
};

export default BroaderCategoriesModal;
