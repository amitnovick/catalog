import React from 'react';
import PropTypes from 'prop-types';

import FileIcon from '../../../components/FileIcon';
import DirectoryIcon from '../../../components/DirectoryIcon';
import { css } from 'emotion';

const fsResourceItemClass = css`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  padding: 1em;
  border: 1px solid grey;
  border-radius: 5px;
  align-items: center;
  height: 100%;
`;

const ChooseTypeModalContent = ({ onChooseFiles, onChooseDirectories }) => {
  return (
    <div
      style={{
        height: '200px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
      <div
        className={fsResourceItemClass}
        style={{
          marginRight: '2em',
        }}>
        <div style={{ height: '100%' }}>
          <DirectoryIcon
            onClick={onChooseDirectories}
            style={{
              width: 150,
              height: 150,
            }}
          />
        </div>
        <div style={{ height: '100%' }}>
          <span>Directories</span>
        </div>
      </div>

      <div className={fsResourceItemClass}>
        <div style={{ height: '100%' }}>
          <FileIcon
            onClick={onChooseFiles}
            style={{
              width: 150,
              height: 150,
            }}
          />
        </div>
        <div style={{ height: '100%' }}>
          <span>Files</span>
        </div>
      </div>
    </div>
  );
};

ChooseTypeModalContent.propTypes = {
  onChooseFiles: PropTypes.func.isRequired,
  onChooseDirectories: PropTypes.func.isRequired,
};

export default ChooseTypeModalContent;
