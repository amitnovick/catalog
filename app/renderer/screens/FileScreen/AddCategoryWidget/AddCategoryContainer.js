import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SearchCategory from '../../../components/SearchCategory';

const getSearchResultCategories = (store) =>
  store && store.specificTagScreen ? store.specificTagScreen.searchResultCategories : [];

const getInputSearchQuery = (store) =>
  store && store.specificTagScreen ? store.specificTagScreen.inputSearchQuery : '';

const AddCategoryContainer = connect((state) => ({
  searchResultCategories: getSearchResultCategories(state),
  inputSearchQuery: getInputSearchQuery(state),
}))(SearchCategory);

AddCategoryContainer.propTypes = {
  onChooseSearchResultCategory: PropTypes.func.isRequired,
  onChangeInputSearchQuery: PropTypes.func.isRequired,
};

export default AddCategoryContainer;
