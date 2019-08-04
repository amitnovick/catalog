//@ts-check
import { Machine } from 'xstate';

const machine = Machine({
  initial: 'filterClosed',
  context: {
    inputText: '',
    chosenCategory: null,
    resultFiles: [],
  },
  states: {
    filterClosed: {
      initial: 'idle',
      states: {
        idle: {},
        searchingWithoutFilter: {
          invoke: {
            src: 'searchWithoutFilter',
            onDone: {
              target: 'idle',
              actions: 'updateResultFiles',
            },
          },
        },
      },
      on: {
        CHANGE_INPUT_TEXT: {
          target: 'searchingWithoutFilter',
          actions: 'updateInputText',
        },
      },
    },
    filterOpen: {
      initial: 'choosing',
      states: {
        choosing: {
          initial: 'idle',
          states: {
            idle: {
              on: {
                CHOOSE_CATEGORY: {
                  target: 'chosen',
                  actions: 'updateChosenCategory',
                },
              },
            },
            searchingWithoutFilter: {
              invoke: {
                src: 'searchWithoutFilter',
                onDone: {
                  target: 'idle',
                  actions: 'updateResultFiles',
                },
              },
            },
          },
          on: {
            CHANGE_INPUT_TEXT: {
              target: 'searchingWithoutFilter',
              actions: 'updateInputText',
            },
          },
        },
        chosen: {
          initial: 'searchingWithFilter',
          states: {
            searchingWithFilter: {
              invoke: {
                src: 'searchWithFilter',
                onDone: {
                  target: 'idle',
                  actions: 'updateResultFiles',
                },
              },
            },
            idle: {
              on: {
                CHANGE_INPUT_TEXT: {
                  target: 'searchingWithFilter',
                  actions: 'updateInputText',
                },
              },
            },
          },
        },
      },
    },
  },
});

export default machine;
