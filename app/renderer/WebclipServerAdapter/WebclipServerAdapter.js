//@ts-check
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

import initHttpServer from '../http-server/initHttpServer';
import { useMachine } from '@xstate/react';
import machine from './machine';

const WEBCLIP_SERVER_ADAPTER_TOAST = 'webclip-server-adapter-toast';

const machineWithConfig = machine.withConfig({
  services: {
    initializeHttpServer: (_, __) => initHttpServer(),
  },
  actions: {
    notifyError: (_, event) =>
      toast(event.data.message, {
        type: 'error',
        autoClose: false,
        position: 'bottom-center',
        containerId: WEBCLIP_SERVER_ADAPTER_TOAST,
      }),
  },
});

const WebclipServerAdapter = () => {
  useMachine(machineWithConfig);

  return (
    <ToastContainer
      enableMultiContainer
      containerId={WEBCLIP_SERVER_ADAPTER_TOAST}
      hideProgressBar={true}
      newestOnTop={true}
      draggable={false}
    />
  );
};

export default WebclipServerAdapter;
