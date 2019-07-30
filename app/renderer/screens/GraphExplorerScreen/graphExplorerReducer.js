import { RECEIVE_ENTITIES } from './actionTypes';

const initialState = {
  childCategories: [],
  files: [],
  categoriesInPath: [],
  categoryRenameModalInputText: '',
  chosenCategoryRenamingCategoryModal: null,
  errorMessageCategoryNameWidget: '',
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_ENTITIES:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
