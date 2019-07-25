import { combineReducers } from 'redux';
import searchScreenReducer from '../screens/SearchScreen/searchScreenReducer';
import tagControlPanelScreenReducer from '../screens/ControlPanelScreen/tagControlPanelScreenReducer';
import graphExplorerScreenReducer from '../screens/GraphExplorerScreen/graphExplorerReducer';
import specificTagScreenReducer from '../screens/FileScreen/FileScreenReducer';
import categoryScreenReducer from '../screens/CategoryScreen/CategoryScreenReducer';
import startupScreenReducer from '../screens/StartupScreens/startupScreenReducer';

export default combineReducers({
  searchScreen: searchScreenReducer,
  tagControlPanelScreen: tagControlPanelScreenReducer,
  graphExplorerScreen: graphExplorerScreenReducer,
  specificTagScreen: specificTagScreenReducer,
  categoryScreen: categoryScreenReducer,
  startupScreen: startupScreenReducer,
});
