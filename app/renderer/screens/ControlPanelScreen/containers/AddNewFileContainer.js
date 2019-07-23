import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AddNewFile from '../components/AddNewFile';
import { RECEIVE_ENTITIES } from '../actionTypes';

const getNewFileName = store =>
  store && store.tagControlPanelScreen
    ? store.tagControlPanelScreen.newFileName
    : '';

const updateNewFileName = newFileName => {
  return {
    type: RECEIVE_ENTITIES,
    payload: {
      newFileName: newFileName
    }
  };
};

const AddNewFileContainer = connect(
  state => ({ newFileName: getNewFileName(state) }),
  {
    onChangeNewFileName: updateNewFileName
  }
)(AddNewFile);

AddNewFileContainer.propTypes = {
  onClickAddFile: PropTypes.func.isRequired
};

export default AddNewFileContainer;
