import { connect } from 'react-redux';
import { RECEIVE_ENTITIES } from '../actionTypes';
import SearchBox from '../components/SearchBox';

const getSearchText = store => {
  return store && store.searchScreen ? store.searchScreen.searchText : '';
};

const updateSearchText = searchText => {
  return {
    type: RECEIVE_ENTITIES,
    payload: {
      searchText: searchText
    }
  };
};

const SearchBoxContainer = connect(
  state => ({ searchText: getSearchText(state) }),
  { updateSearchText: updateSearchText }
)(SearchBox);

export default SearchBoxContainer;
