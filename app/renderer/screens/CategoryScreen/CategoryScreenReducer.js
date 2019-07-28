import { RECEIVE_ENTITIES } from './actionTypes';

const initialState = {
  category: {},
  newCategoryName: '',
  subcategories: [],
  categorizedFiles: [],
  isRootCategory: null,
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
