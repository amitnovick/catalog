import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AddNewCategory from '../components/AddNewCategory';
import { RECEIVE_ENTITIES } from '../actionTypes';

const getNewCategoryName = store =>
  store && store.tagControlPanelScreen
    ? store.tagControlPanelScreen.newCategoryName
    : '';

const updateNewCategoryName = newCategoryName => {
  return {
    type: RECEIVE_ENTITIES,
    payload: {
      newCategoryName: newCategoryName
    }
  };
};

const AddNewCategoryContainer = connect(
  state => ({ newCategoryName: getNewCategoryName(state) }),
  {
    onChangeNewCategoryName: updateNewCategoryName
  }
)(AddNewCategory);

AddNewCategoryContainer.propTypes = {
  onClickAddCategory: PropTypes.func.isRequired
};

export default AddNewCategoryContainer;
