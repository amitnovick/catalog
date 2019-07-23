import { connect } from 'react-redux';
import SearchResultsList from '../components/SearchResultsList';

const getFiles = store =>
  store && store.searchScreen ? store.searchScreen.files : [];

const SearchResultsListContainer = connect(state => ({
  files: getFiles(state)
}))(SearchResultsList);

export default SearchResultsListContainer;
