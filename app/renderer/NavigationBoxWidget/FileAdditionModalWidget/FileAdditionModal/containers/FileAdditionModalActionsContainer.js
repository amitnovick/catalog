import React from 'react';
import { useService } from '@xstate/react';

import FileAdditionModalActions from '../components/FileAdditionModalActions';
import ReactContext from '../../ReactContext';

const FileAdditionModalActionsContainer = () => {
  const service = React.useContext(ReactContext);
  const [current, send] = useService(service);

  const shouldDisableSubmitButton = current.matches('idle.failure');
  return (
    <FileAdditionModalActions
      shouldDisableSubmitButton={shouldDisableSubmitButton}
      onClickCancelButton={() => send('CLICK_CANCEL_BUTTON')}
      onClickSubmitButton={() => send('CLICK_SUBMIT_BUTTON')}
    />
  );
};

export default FileAdditionModalActionsContainer;
