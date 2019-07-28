import { connect } from 'react-redux';

import CategorizedFiles from '../components/CategorizedFiles';

const getCategorizedFiles = (store) =>
  store && store.categoryScreen ? store.categoryScreen.categorizedFiles : [];

const CategorizedFilesContainer = connect((state) => ({
  categorizedFiles: getCategorizedFiles(state),
}))(CategorizedFiles);

export default CategorizedFilesContainer;
