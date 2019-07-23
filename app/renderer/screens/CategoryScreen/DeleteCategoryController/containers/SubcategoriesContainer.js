import { connect } from 'react-redux';

import Subcategories from '../components/Subcategories';

const getSubcategories = store =>
  store && store.categoryScreen ? store.categoryScreen.subcategories : [];

const SubcategoriesContainer = connect(state => ({
  subcategories: getSubcategories(state)
}))(Subcategories);

export default SubcategoriesContainer;
