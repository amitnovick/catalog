import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import FsResourceIcon from './FsResourceIcon';
import fsResourceTypes from '../fsResourceTypes';

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

const FsResourceListItem = ({ fsResource, isSelected, onClickRow, onDoubleClickRow }) => {
  return (
    <li
      className={liClass}
      style={{ backgroundColor: isSelected ? BLUE : 'transparent' }}
      onClick={() => (isSelected ? undefined : onClickRow(fsResource))}
      onDoubleClick={() => onDoubleClickRow()}
      onMouseDown={(event) => event.preventDefault()}
      title="Open in file screen">
      <FsResourceIcon fsResourceType={fsResource.type} />
      <span
        className={`${spanClass} ${threeDotsClass}`}
        style={{ color: isSelected ? 'white' : 'black' }}>
        {fsResource.name}
      </span>
    </li>
  );
};

FsResourceListItem.propTypes = {
  fsResource: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf([fsResourceTypes.FILE, fsResourceTypes.DIRECTORY]).isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClickRow: PropTypes.func.isRequired,
  onDoubleClickRow: PropTypes.func.isRequired,
};

export default FsResourceListItem;
