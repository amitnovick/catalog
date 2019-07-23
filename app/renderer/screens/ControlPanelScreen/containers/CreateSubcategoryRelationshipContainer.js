import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CreateSubcategoryRelationship from '../components/CreateSubcategoryRelationship';
import { RECEIVE_ENTITIES } from '../actionTypes';

const getParentCategoryName = store =>
  store && store.tagControlPanelScreen
    ? store.tagControlPanelScreen.parentCategoryName
    : '';

const getChildCategoryName = store =>
  store && store.tagControlPanelScreen
    ? store.tagControlPanelScreen.childCategoryName
    : '';

const updateParentCategoryName = parentCategoryName => {
  return {
    type: RECEIVE_ENTITIES,
    payload: {
      parentCategoryName: parentCategoryName
    }
  };
};

const updateChildCategoryName = childCategoryName => {
  return {
    type: RECEIVE_ENTITIES,
    payload: {
      childCategoryName: childCategoryName
    }
  };
};

const CreateSubcategoryRelationshipContainer = connect(
  state => ({
    parentCategoryName: getParentCategoryName(state),
    childCategoryName: getChildCategoryName(state)
  }),
  {
    onChangeParentCategoryName: updateParentCategoryName,
    onChangeChildCategoryName: updateChildCategoryName
  }
)(CreateSubcategoryRelationship);

CreateSubcategoryRelationshipContainer.propTypes = {
  onClickCreateRelationship: PropTypes.func.isRequired
};

export default CreateSubcategoryRelationshipContainer;
