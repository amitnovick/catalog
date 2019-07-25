import React from 'react';
import PropTypes from 'prop-types';

import AddCategoryContainer from '../containers/AddCategoryContainer';
import CategoriesContainer from '../containers/CategoriesContainer';
import { Button, Icon, Header, Input, List } from 'semantic-ui-react';

const FileMenu = ({
  file,
  newFileName,
  onClickAddCategory,
  onClickOpenFile,
  onClickCategory,
  onClickDeleteFile,
  onChangeNewFileName,
  onClickRenameFile,
}) => {
  return (
    <>
      <div>
        <h1>File</h1>
        <Header as="h2">{file.name}</Header>
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
        <Button size="massive" color="green" onClick={() => onClickOpenFile(file)}>
          <Icon name="envelope open" />
          Open file
        </Button>
        <Button size="massive" color="red" onClick={() => onClickDeleteFile(file)}>
          <Icon name="remove" /> Delete file
        </Button>
      </div>
      <CategoriesContainer onClickCategory={onClickCategory} />
      <AddCategoryContainer onClickAddCategory={onClickAddCategory} />
    </>
  );
};

FileMenu.propTypes = {
  file: PropTypes.object.isRequired,
  onClickAddCategory: PropTypes.func.isRequired,
  onClickOpenFile: PropTypes.func.isRequired,
  onClickCategory: PropTypes.func.isRequired,
  onClickDeleteFile: PropTypes.func.isRequired,
  newFileName: PropTypes.string.isRequired,
  onChangeNewFileName: PropTypes.func.isRequired,
  onClickRenameFile: PropTypes.func.isRequired,
};

export default FileMenu;
