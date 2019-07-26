import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AddCategory from '../components/AddCategory';

const getSearchResultCategories = (store) =>
  store && store.specificTagScreen ? store.specificTagScreen.searchResultCategories : [];

const getInputSearchQuery = (store) =>
  store && store.specificTagScreen ? store.specificTagScreen.inputSearchQuery : '';

const AddCategoryContainer = connect((state) => ({
  searchResultCategories: getSearchResultCategories(state),
  inputSearchQuery: getInputSearchQuery(state),
}))(AddCategory);

AddCategoryContainer.propTypes = {
  onChooseSearchResultCategory: PropTypes.func.isRequired,
  onChangeInputSearchQuery: PropTypes.func.isRequired,
};

export default AddCategoryContainer;
