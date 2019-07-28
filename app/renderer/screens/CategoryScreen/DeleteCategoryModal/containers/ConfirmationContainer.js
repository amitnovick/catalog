import { connect } from 'react-redux';

import Confirmation from '../components/Confirmation';

const getCategory = (store) => (store && store.categoryScreen ? store.categoryScreen.category : {});

const ConfirmationContainer = connect((state) => ({
  category: getCategory(state),
}))(Confirmation);

export default ConfirmationContainer;
