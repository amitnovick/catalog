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
      contentStyle={{ overflowY: 'auto' }}
      Content={
        <>
          {fsResources.length > 0 ? (
            <List size="big" style={{ padding: 0 }}>
              {fsResources.map((fsResource) => (
                <FsResourcesListItemWithNavigation
                  key={fsResource.id}
                  fsResource={fsResource}
                  isSelected={selectedFileRow !== null && selectedFileRow.id === fsResource.id}
                  onClickRow={onClickRow}
                />
              ))}
            </List>
          ) : (
            <div style={{ padding: '0.5em' }}>
              <Message info>
                <Message.Header>No Files</Message.Header>
              </Message>
            </div>
          )}
        </>
      }
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
