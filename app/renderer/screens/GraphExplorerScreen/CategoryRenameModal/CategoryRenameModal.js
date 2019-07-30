import React from 'react';

import RenameModal from './RenameModal';

// if (current.matches('renaming')) {
//   return (
//     <CategoryListItemRenamingContainer
//       onChangeInputText={(inputText) => send('CHANGE_INPUT_TEXT', { inputText })}
//       onClickCheckmark={() => send('CLICK_CHECKMARK')}
//     />
//   );
// }

// onClickRename={(category) => send('CLICK_RENAME', { inputText: category.name })}

const CategoryRenameModal = ({ isOpen, onClose, onClickRenameButton }) => {
  return (
    <RenameModal isOpen={isOpen} onClose={onClose} onClickRenameButton={onClickRenameButton} />
  );
};

export default CategoryRenameModal;
