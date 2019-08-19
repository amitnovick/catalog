import React from 'react';
import PropTypes from 'prop-types';
import { List, Message } from 'semantic-ui-react';

import AccordionWrapper from './AccordionWrapper';
import FsResourcesListItemWithNavigation from '../../../../containers/FsResourceListItemWithNavigation';
import fsResourceTypes from '../../../../fsResourceTypes';

const FsResourcesAccordion = ({ fsResources, selectedFileRow, onClickRow }) => {
  return (
    <AccordionWrapper
      title="Files"
      shouldDefaultToActive={fsResources.length === 0}
      style={{ height: '100%' }}
      Content={() => (
        <List size="big" style={{ padding: fsResources.length === 0 ? '0.5em' : 0 }}>
          {fsResources.length > 0 ? (
            fsResources.map((fsResource) => (
              <FsResourcesListItemWithNavigation
                key={fsResource.id}
                fsResource={fsResource}
                isSelected={selectedFileRow !== null && selectedFileRow.id === fsResource.id}
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

FsResourcesAccordion.propTypes = {
  fsResources: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.oneOf([fsResourceTypes.FILE, fsResourceTypes.DIRECTORY]).isRequired,
    }).isRequired,
  ).isRequired,
  selectedFileRow: PropTypes.object,
  onClickRow: PropTypes.func.isRequired,
};

export default FsResourcesAccordion;
