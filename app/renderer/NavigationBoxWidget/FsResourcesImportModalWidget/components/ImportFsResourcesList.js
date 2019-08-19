import React from 'react';
import PropTypes from 'prop-types';
import { List, Icon } from 'semantic-ui-react';
import { css } from 'emotion';
import FsResourceListItem from '../../../components/FsResourceListItem';
import fsResourceTypes from '../../../fsResourceTypes';

const overrideCursorClass = css`
  & * {
    cursor: auto !important;
  }
`;

const ImportFsResourcesList = ({
  filesPaths,
  filePathsAttemptOutcomes,
  hasAttemptedCopyingAlready,
  fsResourceType,
}) => {
  return (
    <List style={{ maxHeight: '50vh', overflowY: 'scroll', overflowX: 'scroll' }}>
      {filesPaths.map((filePath) => (
        <div
          className={overrideCursorClass}
          key={filePath}
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
          }}>
          <span>
            {hasAttemptedCopyingAlready ? (
              filePathsAttemptOutcomes[filePath] === true ? (
                <Icon name="checkmark" color="green" />
              ) : (
                <Icon name="remove circle" color="red" />
              )
            ) : (
              <Icon name="minus" />
            )}
          </span>
          <FsResourceListItem
            fsResource={{
              name: filePath,
              type: fsResourceType,
            }}
            isSelected={false}
            onClickRow={() => {}}
            onDoubleClickRow={() => {}}
          />
        </div>
      ))}
    </List>
  );
};

ImportFsResourcesList.propTypes = {
  filesPaths: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  filePathsAttemptOutcomes: PropTypes.object.isRequired,
  hasAttemptedCopyingAlready: PropTypes.bool.isRequired,
  fsResourceType: PropTypes.oneOf([fsResourceTypes.FILE, fsResourceTypes.DIRECTORY]),
};

export default ImportFsResourcesList;
