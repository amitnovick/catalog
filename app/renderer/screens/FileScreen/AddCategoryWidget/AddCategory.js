import React from 'react';
import PropTypes from 'prop-types';
import { Search } from 'semantic-ui-react';

const AddCategory = ({
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
    <div
      style={{
        margin: '0 auto',
        width: '9em',
      }} /* The results width seems to be 18em, so we need half of that */
    >
      <Search
        onResultSelect={handleChange}
        onSearchChange={handleSearchChange}
        results={searchResultCategories.map((searchResultCategory) => ({
          id: searchResultCategory.id,
          title: searchResultCategory.name,
        }))}
        value={inputSearchQuery}
      />
    </div>
  );
};

AddCategory.propTypes = {
  searchResultCategories: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  inputSearchQuery: PropTypes.string.isRequired,
  onChangeInputSearchQuery: PropTypes.func.isRequired,
  onChooseSearchResultCategory: PropTypes.func.isRequired,
};

export default AddCategory;
