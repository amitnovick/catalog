import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import { css } from 'emotion';
import FsResourceListItem from '../../../components/FsResourceListItem';
import fsResourceTypes from '../../../fsResourceTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faMinus } from '@fortawesome/free-solid-svg-icons';

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
    <List style={{ height: '100%', overflowY: 'auto', overflowX: 'auto' }}>
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
          <div>
            {hasAttemptedCopyingAlready ? (
              filePathsAttemptOutcomes[filePath] === true ? (
                <FontAwesomeIcon icon={faCheck} color="green" style={{ width: 30, height: 30 }} />
              ) : (
                <FontAwesomeIcon icon={faTimes} color="red" style={{ width: 30, height: 30 }} />
              )
            ) : (
              <FontAwesomeIcon icon={faMinus} style={{ width: 30, height: 30 }} />
            )}
          </div>
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
