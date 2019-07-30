import React from 'react';
import { Modal, Header, Button, Input } from 'semantic-ui-react';
import { connect } from 'react-redux';

const RenameModal = ({
  category,
  isOpen,
  onClickRenameButton,
  onClose,
  onChangeInputText,
  inputText,
}) => {
  return (
    <Modal
      closeIcon={{ style: { top: '0.8rem', right: '1rem' }, color: 'red', name: 'close' }}
      dimmer="inverted"
      open={isOpen}
      onClose={onClose}>
      <Modal.Header>
        <Header as="h3" textAlign="center">
          {category === null ? '' : `Rename ${category.name}`}
        </Header>
      </Modal.Header>
      <Modal.Content>
        <p>Enter the new name:</p>
        <Input
          type="text"
          value={inputText}
          onChange={({ target }) => onChangeInputText(target.value)}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onClickRenameButton}>Rename</Button>
      </Modal.Actions>
    </Modal>
  );
};

const getChosenCategoryRenamingCategoryModal = (store) =>
  store && store.graphExplorerScreen
    ? store.graphExplorerScreen.chosenCategoryRenamingCategoryModal
    : null;

const getInputText = (store) =>
  store && store.graphExplorerScreen ? store.graphExplorerScreen.categoryRenameModalInputText : '';

// const CategoryListItemRenamingContainer = connect((state) => ({
//   inputText: getInputText(state),
// }))(CategoryListItemRenaming);

export default connect((state) => ({
  category: getChosenCategoryRenamingCategoryModal(state),
  inputText: getInputText(state),
}))(RenameModal);
