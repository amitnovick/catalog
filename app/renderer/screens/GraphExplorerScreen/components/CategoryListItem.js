import React from 'react';
import { withRouter } from 'react-router-dom';
import { List, Icon, Button, Modal, Header } from 'semantic-ui-react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import routes from '../../../routes';
import store from '../../../redux/store';
import { RECEIVE_ENTITIES } from '../actionTypes';

const threeDotsCss = {
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  display: 'inline-block',
  width: '100%',
};

const StyledListItem = styled(List.Item)``;

const StyledDiv = styled.div`
  ${StyledListItem}:hover & {
    background-color: #f0f0f0;
  }
`;

const RenameButton = styled(Button)`
  display: none !important;
  ${StyledListItem}:hover & {
    display: inline-block !important;
  }
`;

const CategoryListItem = ({ category, onDoubleClickRow, onClickRenameButton }) => {
  return (
    <StyledListItem>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <StyledDiv
          onDoubleClick={() => onDoubleClickRow('double!')}
          style={{ display: 'inline-block', width: '100%', cursor: 'pointer' }}>
          <Icon name="folder" color="blue" size="big" />
          <List.Content style={{ display: 'inline-block' }}>{category.name}</List.Content>
        </StyledDiv>
        <RenameButton
          color="grey"
          icon={<Icon name="edit" style={{ color: 'white' }} />}
          onClick={() => onClickRenameButton(category)}
        />
      </div>
    </StyledListItem>
  );
};

const CategoryListItemWrapper = ({ category, onClickRenameButton, history }) => {
  return (
    <CategoryListItem
      category={category}
      onClickRenameButton={onClickRenameButton}
      onDoubleClickRow={() => history.push(`${routes.TREE_EXPLORER}/${category.id}`)}
    />
  );
};

const CategoryListItemWrapperHistoryWrapper = withRouter(CategoryListItemWrapper);

// const CategoryListItemRenaming = ({ onChangeInputText, inputText, onClickCheckmark }) => {
//   return (
//     <List.Item>
//       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//         <div style={{ display: 'flex', width: '100%' }}>
//           <Icon name="folder" color="blue" size="big" />
//           <Input
//             style={{ flexGrow: 1 }}
//             type="text"
//             value={inputText}
//             onChange={({ target }) => onChangeInputText(target.value)}
//           />
//         </div>
//         <Button
//           color="green"
//           icon={<Icon name="checkmark" style={{ color: 'white' }} />}
//           onClick={() => onClickCheckmark()}
//         />
//       </div>
//     </List.Item>
//   );
// };

// const getInputText = (store) =>
//   store && store.graphExplorerScreen ? store.graphExplorerScreen.renameInputText : '';

// const CategoryListItemRenamingContainer = connect((state) => ({
//   inputText: getInputText(state),
// }))(CategoryListItemRenaming);

export default CategoryListItemWrapperHistoryWrapper;
