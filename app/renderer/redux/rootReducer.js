import { combineReducers } from 'redux';
import searchScreenReducer from '../screens/SearchScreen/searchScreenReducer';
import specificTagScreenReducer from '../screens/FileScreen/FileScreenReducer';
import startupScreenReducer from '../screens/StartupScreens/startupScreenReducer';

export default combineReducers({
  searchScreen: searchScreenReducer,
  specificTagScreen: specificTagScreenReducer,
  startupScreen: startupScreenReducer,
});
