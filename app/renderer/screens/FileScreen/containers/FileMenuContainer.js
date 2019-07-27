import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import FileMenu from '../components/FileMenu';

const getFile = (store) => (store && store.specificTagScreen ? store.specificTagScreen.file : '');

const FileMenuContainer = connect((state) => ({
  file: getFile(state),
}))(FileMenu);

FileMenuContainer.propTypes = {
  onClickOpenFile: PropTypes.func.isRequired,
  onClickDeleteFile: PropTypes.func.isRequired,
};

export default FileMenuContainer;
