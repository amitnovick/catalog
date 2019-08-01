import React from 'react';
import { useService } from '@xstate/react';

import ReactContext from '../ReactContext';
import CategorizedFiles from '../components/CategorizedFiles';

const CategorizedFilesContainer = (props) => {
  const service = React.useContext(ReactContext);
  const [current] = useService(service);
  const { categorizedFiles } = current.context;

  return <CategorizedFiles {...props} categorizedFiles={categorizedFiles} />;
};

export default CategorizedFilesContainer;
