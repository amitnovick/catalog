import React from 'react';
import PropTypes from 'prop-types';
import { List, Message } from 'semantic-ui-react';

import AccordionWrapper from './AccordionWrapper';
import FileListItem from '../../../../widgets/FileListItemWithNavigation';

const FilesAccordion = ({ files, selectedFileRow, onClickRow }) => {
  return (
    <AccordionWrapper
      title="Files"
      shouldDefaultToActive={files.length === 0}
      style={{ height: '100%' }}
      Content={() => (
        <List size="big" style={{ padding: files.length === 0 ? '0.5em' : 0 }}>
          {files.length > 0 ? (
            files.map((file) => (
              <FileListItem
                key={file.id}
                file={file}
                isSelected={selectedFileRow !== null && selectedFileRow.id === file.id}
                onClickRow={onClickRow}
              />
            ))
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

FilesAccordion.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  selectedFileRow: PropTypes.object,
  onClickRow: PropTypes.func.isRequired,
};

export default FilesAccordion;
