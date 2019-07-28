import React from 'react';
import PropTypes from 'prop-types';
import { Input, Label, Icon } from 'semantic-ui-react';

const SearchBox = ({ searchText, onChangeSearchText }) => {
  return (
    <Input
      type="text"
      icon="search"
      label={<Label icon={<Icon name="file" style={{ color: '#101010' }} />} color="yellow" />}
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
