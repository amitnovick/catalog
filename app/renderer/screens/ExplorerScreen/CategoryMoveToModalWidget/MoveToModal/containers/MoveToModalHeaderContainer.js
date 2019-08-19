import React from 'react';
import { useService } from '@xstate/react';

import MoveToModalHeader from '../components/MoveToModalHeader';
import ReactContext from '../../ReactContext';

const MoveToModalHeaderContainer = (props) => {
  const service = React.useContext(ReactContext);
  const [current] = useService(service);
  const { childCategory } = current.context;

  return <MoveToModalHeader {...props} category={childCategory} />;
};

export default MoveToModalHeaderContainer;
