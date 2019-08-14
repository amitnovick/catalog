import React from 'react';
import { List, Message } from 'semantic-ui-react';

import AccordionWrapper from './AccordionWrapper';
import FileListItemWrapperHistoryWrapper from './FileListItem';

const FilesAccordion = ({ files }) => {
  return (
    <AccordionWrapper
      title="Files"
      shouldDefaultToActive={files.length === 0}
      style={{ height: '100%' }}
      Content={() => (
        <List size="big">
          {files.length > 0 ? (
            files.map((file) => <FileListItemWrapperHistoryWrapper key={file.id} file={file} />)
          ) : (
            <List.Item>
              <Message info>
                <Message.Header>No Files</Message.Header>
              </Message>
            </List.Item>
          )}
        </List>
      )}
    />
  );
};

export default FilesAccordion;
