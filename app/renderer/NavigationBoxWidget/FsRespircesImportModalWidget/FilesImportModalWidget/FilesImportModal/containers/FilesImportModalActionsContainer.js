import React from 'react';
import { useService } from '@xstate/react';

import FilesImportModalActions from '../components/FilesImportModalActions';
import ReactContext from '../../ReactContext';

const FilesImportModalActionsContainer = () => {
  const service = React.useContext(ReactContext);
  const [current, send] = useService(service);
  const shouldDisableSubmitButton = current.matches('chosen.idle') === false;
  return (
    <FilesImportModalActions
      onClickSubmitButton={() => send('CLICK_IMPORT_BUTTON')}
      onClickCancelButton={() => send('CLICK_CANCEL')}
      shouldDisableSubmitButton={shouldDisableSubmitButton}
    />
  );
};

export default FilesImportModalActionsContainer;
