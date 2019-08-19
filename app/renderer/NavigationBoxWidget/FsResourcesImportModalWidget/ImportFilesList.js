import React from 'react';
import PropTypes from 'prop-types';
import { List, Icon } from 'semantic-ui-react';

const ImportFilesList = ({ filesPaths, filePathsAttemptOutcomes, hasAttemptedCopyingAlready }) => {
  return (
    <List>
      {filesPaths.map((filePath) => (
        <li key={filePath}>
          {hasAttemptedCopyingAlready ? (
            filePathsAttemptOutcomes[filePath] === true ? (
              <Icon name="checkmark" color="green" />
            ) : (
              <Icon name="remove circle" color="red" />
            )
          ) : (
            'No Action Yet'
          )}
          {` | `}
          {filePath}
        </li>
      ))}
    </List>
  );
};

ImportFilesList.propTypes = {
  filesPaths: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  filePathsAttemptOutcomes: PropTypes.object.isRequired,
  hasAttemptedCopyingAlready: PropTypes.bool.isRequired,
};

export default ImportFilesList;
