import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { RECEIVE_ENTITIES } from '../actionTypes';
import FileMenu from '../components/FileMenu';

const getFile = (store) => (store && store.specificTagScreen ? store.specificTagScreen.file : '');

const getNewFileName = (store) =>
  store && store.specificTagScreen ? store.specificTagScreen.newFileName : '';

const updateNewFileName = (newFileName) => ({
  type: RECEIVE_ENTITIES,
  payload: {
    newFileName: newFileName,
  },
});

const FileMenuContainer = connect(
  (state) => ({
    file: getFile(state),
    newFileName: getNewFileName(state),
  }),
  {
    onChangeNewFileName: updateNewFileName,
  },
)(FileMenu);

FileMenuContainer.propTypes = {
  onChooseSearchResultCategory: PropTypes.func.isRequired,
  onChangeInputSearchQuery: PropTypes.func.isRequired,
  onClickOpenFile: PropTypes.func.isRequired,
  onClickCategory: PropTypes.func.isRequired,
  onClickDeleteFile: PropTypes.func.isRequired,
  onClickRenameFile: PropTypes.func.isRequired,
};

export default FileMenuContainer;
