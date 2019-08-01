import React from 'react';
import { useService } from '@xstate/react';

import ReactContext from '../ReactContext';
import Subcategories from '../components/Subcategories';

const SubcategoriesContainer = (props) => {
  const service = React.useContext(ReactContext);
  const [current] = useService(service);
  const { subcategories } = current.context;

  return <Subcategories {...props} subcategories={subcategories} />;
};

export default SubcategoriesContainer;
