import React from 'react';
import { useService } from '@xstate/react';

import ReactContext from '../ReactContext';
import Confirmation from '../components/Confirmation';

const ConfirmationContainer = (props) => {
  const service = React.useContext(ReactContext);
  const [current] = useService(service);
  const { category } = current.context;

  return <Confirmation {...props} category={category} />;
};

export default ConfirmationContainer;
