import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import FsResourceIcon from './FsResourceIcon';
import fsResourceTypes from '../fsResourceTypes';

const BLUE = '#2196F3';

const ICON_SIZE_PX = 30;

const liClass = css`
  padding-top: 8px;
  padding-bottom: 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
  height: 50px;
`;

const spanClass = css`
  display: inline-block;
  font-size: ${ICON_SIZE_PX - 6}px;
  line-height: ${ICON_SIZE_PX - 6}px;
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
      <FsResourceIcon
        style={{ width: ICON_SIZE_PX, height: ICON_SIZE_PX }}
        fsResourceType={fsResource.type}
      />
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
