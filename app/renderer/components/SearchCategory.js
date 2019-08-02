import React from 'react';
import PropTypes from 'prop-types';
import { Search } from 'semantic-ui-react';

const SearchCategory = ({
  inputSearchQuery,
  searchResultCategories,
  onChooseSearchResultCategory: onChangeValue,
  onChangeInputSearchQuery: onSearchQueryChange,
}) => {
  const handleChange = (e, { result }) => {
    onChangeValue({ id: result.id, name: result.title });
  };

  const handleSearchChange = (e, { value }) => {
    onSearchQueryChange(value);
  };

  return (
    <Search
      style={{ display: 'inline' }}
      input={{ icon: 'search', iconPosition: 'left' }}
      onResultSelect={handleChange}
      onSearchChange={handleSearchChange}
      results={searchResultCategories.map((searchResultCategory) => ({
        id: searchResultCategory.id,
        title: searchResultCategory.name,
      }))}
      value={inputSearchQuery}
    />
  );
};

SearchCategory.propTypes = {
  searchResultCategories: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  inputSearchQuery: PropTypes.string.isRequired,
  onChangeInputSearchQuery: PropTypes.func.isRequired,
  onChooseSearchResultCategory: PropTypes.func.isRequired,
};

export default SearchCategory;
