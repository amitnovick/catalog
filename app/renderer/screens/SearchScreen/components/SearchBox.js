import React from 'react';
import { Input, Button, Icon } from 'semantic-ui-react';

const SearchBox = ({ onSearchButtonClick, updateSearchText, searchText }) => {
  return (
    <>
      <Input
        type="text"
        onChange={event => updateSearchText(event.target.value)}
        value={searchText}
      >
        <input />
        <Button onClick={onSearchButtonClick}>
          <Icon name="search" />
          Search
        </Button>
      </Input>
    </>
  );
};

export default SearchBox;
