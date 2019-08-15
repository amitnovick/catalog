import React from 'react';
import { useService } from '@xstate/react';
import ReactContext from '../../ReactContext';
import FilesAccordion from '../components/FilesAccordion';

const FilesAccordionContainer = () => {
  const service = React.useContext(ReactContext);
  const [current, send] = useService(service);

  const { files, selectedFileRow } = current.context;

  return (
    <FilesAccordion
      files={files}
      selectedFileRow={selectedFileRow}
      onClickRow={(file) => send('SELECTED_FILE_ROW', { file: file })}
    />
  );
};

export default FilesAccordionContainer;
