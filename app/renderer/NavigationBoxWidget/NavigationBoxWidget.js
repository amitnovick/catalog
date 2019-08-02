import React from 'react';
import { withRouter } from 'react-router-dom';
import { useMachine } from '@xstate/react';

import NavigationBox from './NavigationBox';
import machine from './machine';
import FileAdditionModalWidget from './FileAdditionModalWidget/FileAdditionModalWidget';
import routes from '../routes';

const machineWithConfig = machine.withConfig({
  actions: {
    navigateToFileScreen: (_, event) => event.history.push(`${routes.FILE}/${event.fileId}`),
  },
});

const NavigationBoxWidget = ({ path, history }) => {
  const [current, send] = useMachine(machineWithConfig);

  return (
    <>
      <NavigationBox path={path} onClickAddButton={() => send('CLICK_ADD_BUTTON')} />
      {current.matches('fileAdditionModal') ? (
        <FileAdditionModalWidget
          onClose={() => send('CLOSE_FILE_ADDITION_MODAL')}
          onFinish={(fileId) => send('FILE_ADDITION_MODAL_SUBMIT', { history, fileId })}
        />
      ) : null}
    </>
  );
};

export default withRouter(NavigationBoxWidget);
