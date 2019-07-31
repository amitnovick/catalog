import React from 'react';
import { useService } from '@xstate/react';

import RenameModalHeader from '../components/RenameModalHeader';
import ReactContext from '../ReactContext';

const RenameModalHeaderContainer = (props) => {
  const service = React.useContext(ReactContext);
  const [current] = useService(service);
  const { category } = current.context;

  return <RenameModalHeader {...props} category={category} />;
};

export default RenameModalHeaderContainer;
