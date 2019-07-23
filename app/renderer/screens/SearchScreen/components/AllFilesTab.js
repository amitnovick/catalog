import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';
import SearchBoxContainer from '../containers/SearchBoxContainer';
import SearchResultsListContainer from '../containers/SearchResultsListContainer';

const AllFilesTab = ({ onSearchButtonClick }) => {
  return (
    <>
      <Header>All Files</Header>
      <SearchBoxContainer onSearchButtonClick={onSearchButtonClick} />
      <SearchResultsListContainer />
    </>
  );
};

AllFilesTab.propTypes = {
  onSearchButtonClick: PropTypes.func.isRequired
};

export default AllFilesTab;
