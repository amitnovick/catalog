import React from 'react';
import PropTypes from 'prop-types';
import { Input, Label, Icon } from 'semantic-ui-react';

const SearchBox = ({ searchText, onChangeSearchText }) => {
  return (
    <Input
      autoFocus
      type="text"
      icon="search"
      label={
        <Label>
          <Icon name="file" style={{ color: '#101010' }} />
          File name
        </Label>
      }
      size="massive"
      value={searchText}
      onChange={({ target }) => onChangeSearchText(target.value)}
    />
  );
};

SearchBox.propTypes = {
  searchText: PropTypes.string.isRequired,
  onChangeSearchText: PropTypes.func.isRequired,
};

export default SearchBox;
