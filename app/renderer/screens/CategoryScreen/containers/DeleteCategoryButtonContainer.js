import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import DeleteCategoryButton from '../components/DeleteCategoryButton';

const getCategory = (store) => (store && store.categoryScreen ? store.categoryScreen.category : {});

const getIsRootCategory = (store) =>
  store && store.categoryScreen ? store.categoryScreen.isRootCategory : null;

const DeleteCategoryButtonContainer = connect((state) => ({
  category: getCategory(state),
  shouldDisableDeleteCategoryButton: getIsRootCategory(state),
}))(DeleteCategoryButton);

DeleteCategoryButtonContainer.propTypes = {
  onClickDeleteCategory: PropTypes.func.isRequired,
};

export default DeleteCategoryButtonContainer;
