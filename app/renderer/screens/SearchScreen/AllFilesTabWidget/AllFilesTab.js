import React from 'react';
import PropTypes from 'prop-types';
import SearchBoxContainer from '../containers/SearchBoxContainer';
import SearchResultsListContainer from '../containers/SearchResultsListContainer';

const AllFilesTab = ({ onChangeSearchText }) => {
  return (
    <>
      <SearchBoxContainer onChangeSearchText={onChangeSearchText} />
      <SearchResultsListContainer />
    </>
  );
};

AllFilesTab.propTypes = {
  onChangeSearchText: PropTypes.func.isRequired,
};

export default AllFilesTab;
