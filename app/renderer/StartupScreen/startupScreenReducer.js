import { RECEIVE_ENTITIES } from './actionTypes';

const initialState = {
  configDirectoryPath: '',
  instancesPaths: [],
  chosenInstancePath: '',
  inputPath: '',
  configScreenErrorMessage: '',
  userFilesSubdirFilesPath: '',
  sqliteFilePath: '',
  addNewInstanceErrorMessage: '',
  loadUserFilesErrorMessage: '',
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_ENTITIES:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
