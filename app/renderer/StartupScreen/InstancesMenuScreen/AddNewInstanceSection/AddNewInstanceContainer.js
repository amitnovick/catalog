import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { RECEIVE_ENTITIES } from '../../actionTypes';
import AddNewInstance from './AddNewInstance';

const getInputPath = (store) => (store && store.startupScreen ? store.startupScreen.inputPath : '');

const updateInputPath = (inputPath) => ({
  type: RECEIVE_ENTITIES,
  payload: {
    inputPath: inputPath,
  },
});

const AddNewInstanceContainer = connect(
  (state) => ({
    inputPath: getInputPath(state),
  }),
  {
    onInput: updateInputPath,
  },
)(AddNewInstance);

AddNewInstanceContainer.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default AddNewInstanceContainer;
