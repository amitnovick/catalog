import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CategoryMenu from '../components/CategoryMenu';
import { RECEIVE_ENTITIES } from '../actionTypes';

const getCategory = store =>
  store && store.categoryScreen ? store.categoryScreen.category : {};

const getNewCategoryName = store =>
  store && store.categoryScreen ? store.categoryScreen.newCategoryName : '';

const updateNewCategoryName = newCategoryName => ({
  type: RECEIVE_ENTITIES,
  payload: {
    newCategoryName: newCategoryName
  }
});

const CategoryMenuContainer = connect(
  state => ({
    category: getCategory(state),
    newCategoryName: getNewCategoryName(state),
    shouldDisableDeleteCategoryButton: getCategory(state).isRoot === true
  }),
  {
    onChangeNewCategoryName: updateNewCategoryName
  }
)(CategoryMenu);

CategoryMenuContainer.propTypes = {
  onClickRenameCategory: PropTypes.func.isRequired,
  onClickDeleteCategory: PropTypes.func.isRequired
};

export default CategoryMenuContainer;
