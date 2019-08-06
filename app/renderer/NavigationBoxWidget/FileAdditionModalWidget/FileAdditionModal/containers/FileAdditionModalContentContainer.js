import React from 'react';
import { useService } from '@xstate/react';

import FileAdditionModalContent from '../components/FileAdditionModalContent';
import ReactContext from '../../ReactContext';

const FileAdditionModalContentContainer = () => {
  const service = React.useContext(ReactContext);
  const [current, send] = useService(service);
  const { errorMessage, inputText } = current.context;

  const shouldShouldErrorMessage = current.matches('idle.failure');

  return (
    <FileAdditionModalContent
      onHitEnterKey={() => send('CLICK_SUBMIT_BUTTON')}
      onChangeInputText={(inputText) => send('CHANGE_INPUT_TEXT', { inputText })}
      inputText={inputText}
      errorMessage={errorMessage}
      shouldShouldErrorMessage={shouldShouldErrorMessage}
    />
  );
};

export default FileAdditionModalContentContainer;
