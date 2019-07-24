import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import EnabledUserFilesPathForm from '../components/EnabledUserFilesPathForm';

const getUserFilesPath = (store) =>
  store && store.startupScreen ? store.startupScreen.userFilesPath : '';

const EnabledUserFilesPathFormContainer = connect((state) => ({
  userFilesPath: getUserFilesPath(state),
}))(EnabledUserFilesPathForm);

EnabledUserFilesPathFormContainer.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onInput: PropTypes.func.isRequired,
};

export default EnabledUserFilesPathFormContainer;
