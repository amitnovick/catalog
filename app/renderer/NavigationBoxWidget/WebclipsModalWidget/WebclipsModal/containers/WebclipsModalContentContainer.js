import React from 'react';
import { useService } from '@xstate/react';

import WebclipsModalContent from '../components/WebclipsModalContent';
import ReactContext from '../../ReactContext';
import NoCategory from '../components/NoCategory';
import ChoosingCategory from '../components/ChoosingCategory';
import CategoryExists from '../components/CategoryExists';
import { Message } from 'semantic-ui-react';

const WebclipsModalContentContainer = () => {
  const service = React.useContext(ReactContext);
  const [current, send] = useService(service);
  const { currentWebclipsCategory } = current.context;

  let WebclipCategoryWidget;
  if (current.matches('noCategory')) {
    WebclipCategoryWidget = () => (
      <NoCategory onClickChooseCategoryButton={() => send('CLICK_CHOOSE_CATEGORY_BUTTON')} />
    );
  } else if (current.matches('choosingCategory')) {
    WebclipCategoryWidget = () => (
      <ChoosingCategory onChoosingCategory={(category) => send('CHOSE_CATEGORY', { category })} />
    );
  } else if (current.matches('categoryExists')) {
    WebclipCategoryWidget = () => (
      <CategoryExists
        currentCategory={currentWebclipsCategory}
        onClickChangeCategoryButton={() => send('CLICK_CHANGE_CATEGORY_BUTTON')}
      />
    );
  } else if (
    current.matches('fetchingWebclipsCategory') ||
    current.matches('choosingState') ||
    current.matches('changingWebclipsCategory')
  ) {
    WebclipCategoryWidget = () => null;
  } else if (current.matches('failure')) {
    WebclipCategoryWidget = () => <Message error>Error occurred</Message>;
  } else {
    WebclipCategoryWidget = () => <Message error>Unknown state</Message>;
  }

  return <WebclipsModalContent Content={WebclipCategoryWidget} />;
};

export default WebclipsModalContentContainer;
