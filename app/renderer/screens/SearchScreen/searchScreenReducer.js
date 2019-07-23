import { RECEIVE_ENTITIES } from './actionTypes';

const initialState = {
  nodes: [],
  searchText: '',
  tag: '',
  categoryName: '',
  files: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_ENTITIES:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
