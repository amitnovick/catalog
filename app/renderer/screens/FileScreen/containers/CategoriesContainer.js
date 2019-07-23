import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Categories from '../components/Categories';

const getCategories = store =>
  store && store.specificTagScreen ? store.specificTagScreen.categories : [];

const CategoriesContainer = connect(state => ({
  categories: getCategories(state)
}))(Categories);

Categories.propTypes = {
  onClickCategory: PropTypes.func.isRequired
};

export default CategoriesContainer;
