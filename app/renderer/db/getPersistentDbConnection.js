import store from '../redux/store';

const sqlite3 = require('sqlite3');

const getSqliteFilePath = (store) =>
  store && store.startupScreen ? store.startupScreen.sqliteFilePath : '';

let persistentDbConnection = undefined;

function getPersistentDbConnection() {
  if (persistentDbConnection === undefined) {
    const sqliteFilePath = getSqliteFilePath(store.getState());
    persistentDbConnection = new sqlite3.Database(sqliteFilePath);
  }
  return persistentDbConnection;
}

export default getPersistentDbConnection;
