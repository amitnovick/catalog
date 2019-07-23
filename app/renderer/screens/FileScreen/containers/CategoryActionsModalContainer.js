import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CategoryActionsModal from '../components/CategoryActionsModal';

const getCategory = store =>
  store && store.specificTagScreen
    ? store.specificTagScreen.chosenCategoryForActionsModal
    : {};

const CategoryActionsModalContainer = connect(state => ({
  category: getCategory(state)
}))(CategoryActionsModal);

CategoryActionsModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onClickRemoveCategory: PropTypes.func.isRequired
};

export default CategoryActionsModalContainer;
