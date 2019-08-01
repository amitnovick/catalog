import React from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import routes from '../../../../routes';

const CategoryActionsModal = ({ isOpen, onClose, category, onClickRemoveCategory }) => {
  return (
    <Modal open={isOpen} closeIcon dimmer onClose={onClose}>
      <Header content="Category Actions:" />
      <Modal.Content>
        <Header>{category === null ? '' : `Category name: ${category.name}`}</Header>
        <Button style={{ margin: 5 }} onClick={() => onClickRemoveCategory(category)}>
          <Icon name="remove" /> Remove category from file
        </Button>
        <br />
        <Button as={Link} to={category === null ? '' : `${routes.TREE_EXPLORER}/${category.id}`}>
          <Icon name="sign-in alternate" /> Go to category page
        </Button>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

CategoryActionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  category: PropTypes.object,
  onClickRemoveCategory: PropTypes.func.isRequired,
};

export default CategoryActionsModal;
