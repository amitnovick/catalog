import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header } from 'semantic-ui-react';
import FileIcon from '../../../components/FileIcon';
import DirectoryIcon from '../../../components/DirectoryIcon';
import { css } from 'emotion';

const divClass = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  & > * {
    margin-right: 1em;
    margin-left: 1em;
  }
`;

const FsResourcePickerModalContent = ({ FsResourcePicker, fsResourceType }) => {
  if (fsResourceType === 'file') {
    return (
      <Modal.Content>
        <div className={divClass}>
          <FileIcon style={{ width: 100, height: 100 }} />
          <div>
            <Header>Choose the files to import:</Header>
            <FsResourcePicker />
          </div>
        </div>
      </Modal.Content>
    );
  } else if (fsResourceType === 'directory') {
    return (
      <Modal.Content>
        <div className={divClass}>
          <DirectoryIcon style={{ width: 100, height: 100 }} />
          <div>
            <Header>Choose the directories to import:</Header>
            <FsResourcePicker />
          </div>
        </div>
      </Modal.Content>
    );
  }
};

FsResourcePickerModalContent.propTypes = {
  FsResourcePicker: PropTypes.any,
  fsResourceType: PropTypes.oneOf(['file', 'directory']),
};

export default FsResourcePickerModalContent;
