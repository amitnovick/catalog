import React from 'react';
import { Input } from 'semantic-ui-react';

const SearchBox = ({ onSearchButtonClick, updateSearchText, searchText }) => {
  return (
    <Input
      label={{ content: 'File name', icon: 'file' }}
      action={{
        icon: 'search',
        color: 'yellow',
        size: 'massive',
        content: 'Search',
        onClick: onSearchButtonClick,
      }}
      size="massive"
      value={searchText}
      onChange={(event) => updateSearchText(event.target.value)}
    />
  );
};

export default SearchBox;
