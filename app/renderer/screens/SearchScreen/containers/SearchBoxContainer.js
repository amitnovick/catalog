import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SearchBox from '../components/SearchBox';

const getSearchText = (store) => {
  return store && store.searchScreen ? store.searchScreen.searchText : '';
};

const SearchBoxContainer = connect((state) => ({ searchText: getSearchText(state) }))(SearchBox);

SearchBoxContainer.propTypes = {
  onChangeSearchText: PropTypes.func.isRequired,
};

export default SearchBoxContainer;
