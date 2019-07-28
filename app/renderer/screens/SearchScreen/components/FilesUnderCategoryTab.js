import React from 'react';
import PropTypes from 'prop-types';
import SearchBoxContainer from '../containers/SearchBoxContainer';
import SearchResultsListContainer from '../containers/SearchResultsListContainer';
import { Input } from 'semantic-ui-react';

const FilesUnderCategoryTab = ({ onChangeSearchText, onChangeCategoryName, categoryName }) => {
  return (
    <>
      <Input
        label={{ icon: 'folder', color: 'blue' }}
        size="massive"
        value={categoryName}
        onChange={({ target }) => onChangeCategoryName(target.value)}
      />

      <br />
      <SearchBoxContainer onChangeSearchText={onChangeSearchText} />
      <SearchResultsListContainer />
    </>
  );
};

FilesUnderCategoryTab.propTypes = {
  onChangeSearchText: PropTypes.func.isRequired,
  onChangeCategoryName: PropTypes.func.isRequired,
  categoryName: PropTypes.string.isRequired,
};

export default FilesUnderCategoryTab;
