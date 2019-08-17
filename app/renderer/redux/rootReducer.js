import { combineReducers } from 'redux';
import startupScreenReducer from '../screens/StartupScreens/startupScreenReducer';

export default combineReducers({
  startupScreen: startupScreenReducer,
});
