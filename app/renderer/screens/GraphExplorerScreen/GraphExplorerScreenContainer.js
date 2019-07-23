import { connect } from 'react-redux';

import GraphExplorerScreen from './GraphExplorerScreen';

const getRepresentorCategory = store =>
  store && store.graphExplorerScreen
    ? store.graphExplorerScreen.representorCategory
    : '';

const getFiles = store =>
  store && store.graphExplorerScreen ? store.graphExplorerScreen.files : [];

const getChildCategories = store =>
  store && store.graphExplorerScreen
    ? store.graphExplorerScreen.childCategories
    : [];

const getParentCategories = store =>
  store && store.graphExplorerScreen
    ? store.graphExplorerScreen.parentCategories
    : [];

const GraphExplorerScreenContainer = connect(state => ({
  representorCategory: getRepresentorCategory(state),
  files: getFiles(state),
  childCategories: getChildCategories(state),
  parentCategories: getParentCategories(state)
}))(GraphExplorerScreen);

export default GraphExplorerScreenContainer;
