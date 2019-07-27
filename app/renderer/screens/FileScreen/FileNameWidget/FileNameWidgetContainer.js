import { connect } from 'react-redux';

import FileNameWidget from '../FileNameWidget/FileNameWidget';

const getFile = (store) => (store && store.specificTagScreen ? store.specificTagScreen.file : '');

const FileNameWidgetContainer = connect((state) => ({
  file: getFile(state),
}))(FileNameWidget);

export default FileNameWidgetContainer;
