import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import FileNameWidget from '../FileNameWidget/FileNameWidget';
import { RECEIVE_ENTITIES } from '../actionTypes';

const getFile = (store) => (store && store.specificTagScreen ? store.specificTagScreen.file : '');

const getNewFileName = (store) =>
  store && store.specificTagScreen ? store.specificTagScreen.newFileName : '';

const updateNewFileName = (newFileName) => ({
  type: RECEIVE_ENTITIES,
  payload: {
    newFileName: newFileName,
  },
});

const FileNameWidgetContainer = connect(
  (state) => ({
    file: getFile(state),
    newFileName: getNewFileName(state),
  }),
  {
    onChangeNewFileName: updateNewFileName,
  },
)(FileNameWidget);

FileNameWidgetContainer.propTypes = {
  onClickRenameFile: PropTypes.func.isRequired,
};

export default FileNameWidgetContainer;
