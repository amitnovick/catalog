import React from 'react';
import { useMachine } from '@xstate/react';
import PropTypes from 'prop-types';

import machine from './machine';
import WebclipsModal from './WebclipsModal/WebclipsModal';
import { assign } from 'xstate';
import queryWebclipsCategory from '../../db/queries/queryWebclipsCategory';
import ReactContext from './ReactContext';
import queryUpdateWebclipsCategory from '../../db/transactions/queryUpdateWebclipsCategory';

const fetchWebclipsCategory = async () => {
  const webclipsCategory = await queryWebclipsCategory();
  return webclipsCategory;
};

const changeWebclipsCategory = async (category) => {
  await queryUpdateWebclipsCategory(category);
};

const machineWithConfig = machine.withConfig({
  services: {
    fetchWebclipsCategory: (_, __) => fetchWebclipsCategory(),
    changeWebclipsCategory: (_, event) => changeWebclipsCategory(event.category),
  },
  actions: {
    updateCurrentWebclipsCategory: assign({ currentWebclipsCategory: (_, event) => event.data }),
  },
  guards: {
    doesWebclipsCategoryExist: (context, _) => context.currentWebclipsCategory !== null,
  },
});

const WebclipsModalWidget = ({ onClose }) => {
  const [current, , service] = useMachine(machineWithConfig, {
    actions: {
      onClose: (_, __) => onClose(),
    },
    devTools: true,
  });

  return (
    <ReactContext.Provider value={service}>
      <WebclipsModal onClose={onClose} />
    </ReactContext.Provider>
  );
};

WebclipsModalWidget.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default WebclipsModalWidget;
