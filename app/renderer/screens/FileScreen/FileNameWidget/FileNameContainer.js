import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import FileName from './FileName';

const getFile = (store) => (store && store.specificTagScreen ? store.specificTagScreen.file : '');

const getNewFileName = (store) =>
  store && store.specificTagScreen ? store.specificTagScreen.newFileName : '';

const FileNameContainer = connect((state) => ({
  file: getFile(state),
  newFileName: getNewFileName(state),
}))(FileName);

FileNameContainer.propTypes = {
  onClickRenameFile: PropTypes.func.isRequired,
  onChangeInputText: PropTypes.func.isRequired,
};

export default FileNameContainer;
