import React from 'react';
import PropTypes from 'prop-types';
import { List, Icon } from 'semantic-ui-react';
import FileListItem from '../../../components/FileListItem';
import DirectoryListItem from '../../../components/DirectoryListItem';
import { css } from 'emotion';

const fsResourceTypes = {
  FILE: 'file',
  DIRECTORY: 'directory',
};

const overrideCursorClass = css`
  & * {
    cursor: auto !important;
  }
`;

const FsResourceItem = ({ fsResourcepath, fsResourceType }) => {
  if (fsResourceType === fsResourceTypes.FILE) {
    return (
      <FileListItem
        file={{ name: fsResourcepath }}
        isSelected={false}
        onClickRow={() => {}}
        onDoubleClickRow={() => {}}
      />
    );
  } else if (fsResourceType === fsResourceTypes.DIRECTORY) {
    return (
      <DirectoryListItem
        directory={{ name: fsResourcepath }}
        isSelected={false}
        onClickRow={() => {}}
        onDoubleClickRow={() => {}}
      />
    );
  }
};

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
          <FsResourceItem fsResourcepath={filePath} fsResourceType={fsResourceType} />
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
