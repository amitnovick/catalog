import { combineReducers } from 'redux';
import searchScreenReducer from '../screens/SearchScreen/searchScreenReducer';
import tagControlPanelScreenReducer from '../screens/ControlPanelScreen/tagControlPanelScreenReducer';
import specificTagScreenReducer from '../screens/FileScreen/FileScreenReducer';
import startupScreenReducer from '../screens/StartupScreens/startupScreenReducer';

export default combineReducers({
  searchScreen: searchScreenReducer,
  tagControlPanelScreen: tagControlPanelScreenReducer,
  specificTagScreen: specificTagScreenReducer,
  startupScreen: startupScreenReducer,
});
