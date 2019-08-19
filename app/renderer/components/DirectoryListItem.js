import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

import DirectoryIcon from './DirectoryIcon';

const BLUE = '#2196F3';

const liClass = css`
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
`;

const spanClass = css`
  display: inline-block;
`;

const threeDotsClass = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DirectoryListItem = ({ directory, isSelected, onClickRow, onDoubleClickRow }) => {
  return (
    <li
      className={liClass}
      style={{ backgroundColor: isSelected ? BLUE : 'transparent' }}
      onClick={() => (isSelected ? undefined : onClickRow(directory))}
      onDoubleClick={() => onDoubleClickRow()}
      onMouseDown={(event) => event.preventDefault()}
      title="Open in file screen">
      <DirectoryIcon size="lg" style={{ marginRight: '0.5em', marginLeft: '0.2em' }} />
      <span
        className={`${spanClass} ${threeDotsClass}`}
        style={{ color: isSelected ? 'white' : 'black' }}>
        {directory.name}
      </span>
    </li>
  );
};

DirectoryListItem.propTypes = {
  directory: PropTypes.any,
  isSelected: PropTypes.bool.isRequired,
  onClickRow: PropTypes.func.isRequired,
  onDoubleClickRow: PropTypes.func.isRequired,
};

export default DirectoryListItem;
