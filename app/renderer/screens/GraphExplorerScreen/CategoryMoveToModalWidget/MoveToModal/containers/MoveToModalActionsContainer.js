import React from 'react';
import { useService } from '@xstate/react';

import MoveToModalActions from '../components/MoveToModalActions';
import ReactContext from '../../ReactContext';

const MoveToModalActionsContainer = () => {
  const service = React.useContext(ReactContext);
  const [current, send] = useService(service);

  const isSubmitButtonDisabled = current.matches('chosenResult.idle') === false;

  return (
    <MoveToModalActions
      onClickCancelButton={() => send('CLICK_CANCEL')}
      onClickSubmitButton={() => send('CLICK_SUBMIT')}
      isSubmitButtonDisabled={isSubmitButtonDisabled}
    />
  );
};

export default MoveToModalActionsContainer;
