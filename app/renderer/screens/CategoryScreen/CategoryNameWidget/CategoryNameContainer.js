import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CategoryName from './CategoryName';

const getCategory = (store) => (store && store.categoryScreen ? store.categoryScreen.category : {});

const getNewCategoryName = (store) =>
  store && store.categoryScreen ? store.categoryScreen.newCategoryName : '';

const CategoryNameContainer = connect((state) => ({
  category: getCategory(state),
  newCategoryName: getNewCategoryName(state),
}))(CategoryName);

CategoryNameContainer.propTypes = {
  onChangeInputText: PropTypes.func.isRequired,
  onClickRenameCategory: PropTypes.func.isRequired,
};

export default CategoryNameContainer;
