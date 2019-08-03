import React from 'react';
import { useService } from '@xstate/react';

import FileImportModalActions from '../components/FileImportModalActions';
import ReactContext from '../../ReactContext';

const FileImportModalActionsContainer = () => {
  const service = React.useContext(ReactContext);
  const [current, send] = useService(service);
  const shouldDisableSubmitButton = current.matches('chosen.idle') === false;
  return (
    <FileImportModalActions
      onClickSubmitButton={() => send('CLICK_IMPORT_BUTTON')}
      onClickCancelButton={() => send('CLICK_CANCEL')}
      shouldDisableSubmitButton={shouldDisableSubmitButton}
    />
  );
};

export default FileImportModalActionsContainer;
