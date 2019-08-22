import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';
import FileIcon from '../../../components/FileIcon';
import DirectoryIcon from '../../../components/DirectoryIcon';
import { css } from 'emotion';
import ModalContent from '../ModalContent';

const innerDivClass = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  & > * {
    margin-right: 1em;
    margin-left: 1em;
  }
`;

const outerDivClass = css`
  height: 100%;
  display: flex !important;
  flex-direction: column;
  justify-content: center;
`;

const FsResourcePickerModalContent = ({ FsResourcePicker, fsResourceType }) => {
  if (fsResourceType === 'file') {
    return (
      <ModalContent>
        <div className={outerDivClass}>
          <div className={innerDivClass}>
            <FileIcon style={{ width: 100, height: 100 }} />
            <div>
              <Header>Choose the files to import:</Header>
              <FsResourcePicker />
            </div>
          </div>
        </div>
      </ModalContent>
    );
  } else if (fsResourceType === 'directory') {
    return (
      <ModalContent>
        <div className={outerDivClass}>
          <div className={innerDivClass}>
            <DirectoryIcon style={{ width: 100, height: 100 }} />
            <div>
              <Header>Choose the directories to import:</Header>
              <FsResourcePicker />
            </div>
          </div>
        </div>
      </ModalContent>
    );
  }
};

FsResourcePickerModalContent.propTypes = {
  FsResourcePicker: PropTypes.any,
  fsResourceType: PropTypes.oneOf(['file', 'directory']),
};

export default FsResourcePickerModalContent;
