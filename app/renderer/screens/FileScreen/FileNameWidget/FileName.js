import React from 'react';
import PropTypes from 'prop-types';

import { Header, Input, Button } from 'semantic-ui-react';

const FileNameWidget = ({ file, newFileName, onChangeInputText, onClickRenameFile }) => {
  return (
    <>
      <Header as="h1">File Screen</Header>
      <Input type="text" size="massive">
        <Input value={newFileName} onChange={({ target }) => onChangeInputText(target.value)} />
        <Button icon="edit" size="massive" onClick={() => onClickRenameFile(file, newFileName)} />
      </Input>
    </>
  );
};

FileNameWidget.propTypes = {
  file: PropTypes.object.isRequired,
  newFileName: PropTypes.string.isRequired,
  onChangeInputText: PropTypes.func.isRequired,
  onClickRenameFile: PropTypes.func.isRequired,
};

export default FileNameWidget;
