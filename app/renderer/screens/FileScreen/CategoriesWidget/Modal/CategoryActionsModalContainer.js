import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CategoryActionsModal from './CategoryActionsModal';

const getChosenCategoryForActionsModal = (store) =>
  store && store.specificTagScreen ? store.specificTagScreen.chosenCategoryForActionsModal : null;

const CategoryActionsModalContainer = connect((state) => ({
  category: getChosenCategoryForActionsModal(state),
}))(CategoryActionsModal);

CategoryActionsModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onClickRemoveCategory: PropTypes.func.isRequired,
};

export default CategoryActionsModalContainer;
