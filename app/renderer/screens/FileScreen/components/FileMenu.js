import React from 'react';
import PropTypes from 'prop-types';

import { Button, Icon, Input, List } from 'semantic-ui-react';

const FileMenu = ({
  file,
  newFileName,
  onClickOpenFile,
  onClickDeleteFile,
  onChangeNewFileName,
  onClickRenameFile,
}) => {
  return (
    <>
      <List>
        <List.Item>
          <Input type="text" size="massive">
            <Input
              value={newFileName}
              onChange={({ target }) => onChangeNewFileName(target.value)}
            />
            <Button size="massive" onClick={() => onClickRenameFile(file, newFileName)}>
              <Icon name="edit" />
              Rename file
            </Button>
          </Input>
        </List.Item>
      </List>
      <br />
      <Button
        icon="envelope open"
        size="massive"
        color="green"
        onClick={() => onClickOpenFile(file)}
      />
      <Button icon="trash" size="massive" color="red" onClick={() => onClickDeleteFile(file)} />
    </>
  );
};

FileMenu.propTypes = {
  file: PropTypes.object.isRequired,
  onClickOpenFile: PropTypes.func.isRequired,
  onClickDeleteFile: PropTypes.func.isRequired,
  newFileName: PropTypes.string.isRequired,
  onChangeNewFileName: PropTypes.func.isRequired,
  onClickRenameFile: PropTypes.func.isRequired,
};

export default FileMenu;
