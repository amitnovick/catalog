import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { RECEIVE_ENTITIES } from '../actionTypes';
import AddCategory from '../components/AddCategory';

const getParentCategoryName = store =>
  store && store.specificTagScreen
    ? store.specificTagScreen.inputParentTag
    : null;

const getFile = store =>
  store && store.specificTagScreen ? store.specificTagScreen.file : null;

const updateParentCategoryName = inputParentTag => {
  return {
    type: RECEIVE_ENTITIES,
    payload: {
      inputParentTag
    }
  };
};

const AddCategoryContainer = connect(
  state => ({
    parentCategoryName: getParentCategoryName(state),
    file: getFile(state)
  }),
  { onChangeParentCategoryName: updateParentCategoryName }
)(AddCategory);

AddCategoryContainer.propTypes = {
  onClickAddCategory: PropTypes.func.isRequired
};

export default AddCategoryContainer;
