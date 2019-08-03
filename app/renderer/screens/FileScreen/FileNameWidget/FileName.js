import React from 'react';
import PropTypes from 'prop-types';

import { Input, Button } from 'semantic-ui-react';

const FileName = ({ file, newFileName, onChangeInputText, onClickRenameFile }) => {
  return (
    <Input type="text" size="massive">
      <Input value={newFileName} onChange={({ target }) => onChangeInputText(target.value)} />
      <Button icon="edit" size="massive" onClick={() => onClickRenameFile(file, newFileName)} />
    </Input>
  );
};

FileName.propTypes = {
  file: PropTypes.object.isRequired,
  newFileName: PropTypes.string.isRequired,
  onChangeInputText: PropTypes.func.isRequired,
  onClickRenameFile: PropTypes.func.isRequired,
};

export default FileName;
