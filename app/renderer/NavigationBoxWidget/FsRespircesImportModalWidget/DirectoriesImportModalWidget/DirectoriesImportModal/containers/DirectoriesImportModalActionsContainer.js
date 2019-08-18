import React from 'react';
import { useService } from '@xstate/react';

import DirectoriesImportModalActions from '../components/DirectoriesImportModalActions';
import ReactContext from '../../ReactContext';

const DirectoriesImportModalActionsContainer = () => {
  const service = React.useContext(ReactContext);
  const [current, send] = useService(service);
  const shouldDisableSubmitButton = current.matches('chosen.idle') === false;
  return (
    <DirectoriesImportModalActions
      onClickSubmitButton={() => send('CLICK_IMPORT_BUTTON')}
      onClickCancelButton={() => send('CLICK_CANCEL')}
      shouldDisableSubmitButton={shouldDisableSubmitButton}
    />
  );
};

export default DirectoriesImportModalActionsContainer;
