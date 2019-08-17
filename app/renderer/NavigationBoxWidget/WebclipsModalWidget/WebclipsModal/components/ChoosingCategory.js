import React from 'react';
import SearchCategoryWidget from '../../../../widgets/SearchCategoryWidget/SearchCategoryWidget';
import PropTypes from 'prop-types';

const ChoosingCategory = ({ onChoosingCategory }) => {
  return <SearchCategoryWidget onFinish={(category) => onChoosingCategory(category)} />;
};

ChoosingCategory.propTypes = {
  onChoosingCategory: PropTypes.func.isRequired,
};

export default ChoosingCategory;
