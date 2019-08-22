//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'webclip-server-adapter',
  initial: 'initializingHttpServer',
  states: {
    initializingHttpServer: {
      invoke: {
        src: 'initializeHttpServer',
        onError: {
          actions: 'notifyError',
        },
      },
    },
  },
});

export default machine;
