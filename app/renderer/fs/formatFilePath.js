import store from '../redux/store';
const path = require('path');

const getUserFilesSubdirFilesPath = store =>
  store && store.startupScreen
    ? store.startupScreen.userFilesSubdirFilesPath
    : '';

const formatFilePath = fileName => {
  const filesSubdirPath = getUserFilesSubdirFilesPath(store.getState());
  const filePath = path.join(filesSubdirPath, fileName);
  return filePath;
};

export default formatFilePath;
