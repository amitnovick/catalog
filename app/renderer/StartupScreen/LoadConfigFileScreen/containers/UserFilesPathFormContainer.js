import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import UserFilesPathForm from '../components/UserFilesPathForm';
import { RECEIVE_ENTITIES } from '../../actionTypes';

const getChosenUserFilesPath = store =>
  store && store.startupScreen ? store.startupScreen.chosenUserFilesPath : '';

const updateChosenUserFilesPath = chosenUserFilesPath => ({
  type: RECEIVE_ENTITIES,
  payload: {
    chosenUserFilesPath: chosenUserFilesPath
  }
});

const UserFilesPathFormContainer = connect(
  state => ({
    chosenUserFilesPath: getChosenUserFilesPath(state)
  }),
  {
    onChangeChosenUserFilesPath: updateChosenUserFilesPath
  }
)(UserFilesPathForm);

UserFilesPathFormContainer.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default UserFilesPathFormContainer;
