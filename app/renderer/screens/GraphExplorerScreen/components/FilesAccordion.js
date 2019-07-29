import React from 'react';
import AccordionWrapper from './AccordionWrapper';
import { List, Icon, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import routes from '../../../routes';

const threeDotsCss = {
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  display: 'inline-block',
  width: '100%',
};

const FilesAccordion = ({ files }) => {
  return (
    <AccordionWrapper
      title="Files"
      shouldDefaultToActive={files.length === 0}
      Content={() => (
        <List divided selection verticalAlign="middle">
          {files.length > 0 ? (
            files.map((file) => (
              <List.Item key={file.id} as={Link} to={`${routes.FILE}/${file.id}`}>
                <Icon name="file" color="yellow" size="large" />
                <List.Content>
                  <List.Header style={threeDotsCss}>{file.name}</List.Header>
                </List.Content>
              </List.Item>
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

export default FilesAccordion;
