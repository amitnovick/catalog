import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { RECEIVE_ENTITIES } from '../actionTypes';
import FilesUnderCategoryTab from '../components/FilesUnderCategoryTab';

const getCategoryName = (store) => {
  return store && store.searchScreen ? store.searchScreen.categoryName : '';
};

const updateCategoryName = (categoryName) => {
  return {
    type: RECEIVE_ENTITIES,
    payload: {
      categoryName: categoryName,
    },
  };
};

const FilesUnderCategoryTabContainer = connect(
  (state) => ({ categoryName: getCategoryName(state) }),
  { onChangeCategoryName: updateCategoryName },
)(FilesUnderCategoryTab);

FilesUnderCategoryTab.propTypes = {
  onChangeSearchText: PropTypes.func.isRequired,
};

export default FilesUnderCategoryTabContainer;
