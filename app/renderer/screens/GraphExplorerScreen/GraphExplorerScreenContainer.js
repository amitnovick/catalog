import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import GraphExplorerScreen from './GraphExplorerScreen';

const getRepresentorCategory = (store) =>
  store && store.graphExplorerScreen ? store.graphExplorerScreen.representorCategory : '';

const getFiles = (store) =>
  store && store.graphExplorerScreen ? store.graphExplorerScreen.files : [];

const getChildCategories = (store) =>
  store && store.graphExplorerScreen ? store.graphExplorerScreen.childCategories : [];

const getParentCategory = (store) =>
  store && store.graphExplorerScreen ? store.graphExplorerScreen.parentCategory : null;

const getCategoriesInPath = (store) =>
  store && store.graphExplorerScreen ? store.graphExplorerScreen.categoriesInPath : [];

const GraphExplorerScreenContainer = connect((state) => ({
  representorCategory: getRepresentorCategory(state),
  files: getFiles(state),
  childCategories: getChildCategories(state),
  parentCategory: getParentCategory(state),
  categoriesInPath: getCategoriesInPath(state),
}))(GraphExplorerScreen);

GraphExplorerScreenContainer.propTypes = {
  initialCategoryId: PropTypes.any,
};

export default GraphExplorerScreenContainer;
