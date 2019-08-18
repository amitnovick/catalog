//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  id: 'fs-resources-import-modal-widget',
  initial: 'choosing',
  states: {
    choosing: {
      on: {
        CHOOSE_FILES: 'files',
        CHOOSE_DIRECTORIES: 'directories',
      },
    },
    files: {},
    directories: {},
  },
});

export default machine;
