import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Confirmation from '../components/Confirmation';

const getCategory = store =>
  store && store.categoryScreen ? store.categoryScreen.category : {};

const ConfirmationContainer = connect(state => ({
  category: getCategory(state)
}))(Confirmation);

ConfirmationContainer.propTypes = {
  onConfirmDelete: PropTypes.func.isRequired,
  onCancelDelete: PropTypes.func.isRequired
};

export default ConfirmationContainer;
