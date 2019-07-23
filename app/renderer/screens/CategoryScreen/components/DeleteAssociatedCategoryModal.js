import React from 'react';
import PropTypes from 'prop-types';
import { Header, Modal } from 'semantic-ui-react';
import DeleteCategoryModalController from '../DeleteCategoryController/DeleteCategoryModalController';

const DeleteAssociatedCategoryModal = ({
  isOpen,
  onClose,
  onConfirmDelete
}) => {
  return (
    <Modal open={isOpen} closeIcon dimmer onClose={onClose}>
      <Header
        icon="archive"
        content="Delete Associated Subcategories / Files"
      />
      <Modal.Content>
        {isOpen ? (
          <DeleteCategoryModalController
            onConfirmDelete={onConfirmDelete}
            onCancelDelete={onClose}
          />
        ) : null}
      </Modal.Content>
      <Modal.Actions />
    </Modal>
  );
};

DeleteAssociatedCategoryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirmDelete: PropTypes.func.isRequired
};

export default DeleteAssociatedCategoryModal;
