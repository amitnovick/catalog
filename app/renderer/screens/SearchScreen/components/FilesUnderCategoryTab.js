import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';
import SearchBoxContainer from '../containers/SearchBoxContainer';
import SearchResultsListContainer from '../containers/SearchResultsListContainer';
import { Input } from 'semantic-ui-react';

const FilesUnderCategoryTab = ({ onSearchButtonClick, onChangeCategoryName, categoryName }) => {
  return (
    <>
      <Input
        label={{ content: 'Category name', icon: 'folder' }}
        size="massive"
        value={categoryName}
        onChange={({ target }) => onChangeCategoryName(target.value)}
      />

      <br />
      <SearchBoxContainer onSearchButtonClick={onSearchButtonClick} />
      <SearchResultsListContainer />
    </>
  );
};

FilesUnderCategoryTab.propTypes = {
  onSearchButtonClick: PropTypes.func.isRequired,
  onChangeCategoryName: PropTypes.func.isRequired,
  categoryName: PropTypes.string.isRequired,
};

export default FilesUnderCategoryTab;
