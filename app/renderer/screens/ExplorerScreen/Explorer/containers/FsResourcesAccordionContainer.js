import React from 'react';
import { useService } from '@xstate/react';
import ReactContext from '../../ReactContext';
import FsResourcesAccordion from '../components/FsResourcesAccordion';

const FsResourcesAccordionContainer = () => {
  const service = React.useContext(ReactContext);
  const [current, send] = useService(service);

  const { fsResources, selectedFsResourceRow } = current.context;

  return (
    <FsResourcesAccordion
      fsResources={fsResources}
      selectedFileRow={selectedFsResourceRow}
      onClickRow={(fsResource) => send('SELECTED_FS_RESOURCE_ROW', { fsResource: fsResource })}
    />
  );
};

export default FsResourcesAccordionContainer;
