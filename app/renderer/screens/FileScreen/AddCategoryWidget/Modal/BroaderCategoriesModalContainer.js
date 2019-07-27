import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import BroaderCategoriesModal from './BroaderCategoriesModal';

const getBroaderCategories = (store) =>
  store && store.specificTagScreen ? store.specificTagScreen.broaderFileCategories : [];

const BroaderCategoriesModalContainer = connect((state) => ({
  broaderCategories: getBroaderCategories(state),
}))(BroaderCategoriesModal);

BroaderCategoriesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onClickYes: PropTypes.func.isRequired,
};

export default BroaderCategoriesModalContainer;
