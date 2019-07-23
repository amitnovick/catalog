import { Machine } from 'xstate';

const idleStates = {
  initial: 'idle',
  states: {
    idle: {},
    success: {},
    failure: {}
  }
};

const machine = Machine({
  id: 'control-panel',
  initial: 'idle',
  states: {
    idle: {
      ...idleStates,
      on: {
        ADD_NEW_CATEGORY: 'loadingAddingNewCategory',
        CREATE_RELATIONSHIP: 'loadingCreatingRelationship'
      }
    },
    loadingAddingNewCategory: {
      invoke: {
        src: 'addNewCategory',
        onDone: 'idle.success',
        onError: 'idle.failure'
      }
    },
    loadingCreatingRelationship: {
      invoke: {
        src: 'createRelationship',
        onDone: 'idle.success',
        onError: 'idle.failure'
      }
    },
    failure: {}
  }
});

export default machine;
