import store from '../redux/store';

const sqlite3 = require('sqlite3');

const getSqliteFilePath = (store) =>
  store && store.startupScreen ? store.startupScreen.sqliteFilePath : '';

let sqlDriver = undefined;

function getSqlDriver() {
  if (sqlDriver === undefined) {
    const sqliteFilePath = getSqliteFilePath(store.getState());
    sqlDriver = new sqlite3.Database(sqliteFilePath);
  }
  return sqlDriver;
}

export default getSqlDriver;
