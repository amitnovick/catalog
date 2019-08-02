import React from 'react';
import { useService } from '@xstate/react';

import MoveToModalContent from '../components/MoveToModalContent';
import ReactContext from '../../ReactContext';
import SearchCategoryWidget from '../SearchCategoryWidget/SearchCategoryWidget';
import { Message, Button, Icon } from 'semantic-ui-react';

const ChosenCategory = ({ category, onClickClearButton }) => {
  return (
    <Button onClick={() => onClickClearButton()} icon labelPosition="right">
      {category.name}
      <Icon name="redo" />
    </Button>
  );
};

const MoveToModalContentContainer = (props) => {
  const service = React.useContext(ReactContext);
  const [current, send] = useService(service);
  const { errorMessage, chosenParentCategory } = current.context;

  let ModalContent;

  if (current.matches('searching')) {
    ModalContent = () => (
      <SearchCategoryWidget
        onFinish={(chosenParentCategory) =>
          send('CHOOSE_PARENT_CATEGORY', { chosenParentCategory })
        }
      />
    );
  } else if (current.matches('chosenResult')) {
    if (
      current.matches('chosenResult.idle') ||
      current.matches('chosenResult.checkingForParentCategoryValidity') ||
      current.matches('chosenResult.deletingParentCategoryOfFilesWithBothParentAndChild') ||
      current.matches('chosenResult.updatingParentCategoryOfChildCategory')
    ) {
      ModalContent = () => (
        <ChosenCategory
          category={chosenParentCategory}
          onClickClearButton={() => send('CLICK_CLEAR_CHOSEN_CATEGORY')}
        />
      );
    } else if (current.matches('chosenResult.failure')) {
      ModalContent = () => (
        <>
          <ChosenCategory
            category={chosenParentCategory}
            onClickClearButton={() => send('CLICK_CLEAR_CHOSEN_CATEGORY')}
          />
          <Message error content={errorMessage} />
        </>
      );
    } else {
      ModalContent = (
        <>
          <ChosenCategory
            category={chosenParentCategory}
            onClickClearButton={() => send('CLICK_CLEAR_CHOSEN_CATEGORY')}
          />
          <Message error content={'Unknown state'} />
        </>
      );
    }
  } else {
    ModalContent = () => <h2>Unknown state</h2>;
  }

  return <MoveToModalContent {...props} ModalContent={ModalContent} />;
};

export default MoveToModalContentContainer;
