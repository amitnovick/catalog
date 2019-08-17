import { combineReducers } from 'redux';
import searchScreenReducer from '../screens/SearchScreen/searchScreenReducer';
import startupScreenReducer from '../screens/StartupScreens/startupScreenReducer';

export default combineReducers({
  searchScreen: searchScreenReducer,
  startupScreen: startupScreenReducer,
});
