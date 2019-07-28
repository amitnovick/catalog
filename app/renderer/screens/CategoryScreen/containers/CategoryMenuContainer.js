import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CategoryMenu from '../components/CategoryMenu';

const getCategory = (store) => (store && store.categoryScreen ? store.categoryScreen.category : {});

const getIsRootCategory = (store) =>
  store && store.categoryScreen ? store.categoryScreen.isRootCategory : null;

const CategoryMenuContainer = connect((state) => ({
  category: getCategory(state),
  shouldDisableDeleteCategoryButton: getIsRootCategory(state),
}))(CategoryMenu);

CategoryMenuContainer.propTypes = {
  onClickDeleteCategory: PropTypes.func.isRequired,
};

export default CategoryMenuContainer;
