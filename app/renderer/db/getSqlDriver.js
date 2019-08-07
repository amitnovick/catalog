import store from '../redux/store';

const sqlite3 = window
  .require('sqlite3')
  .verbose(); /* Note: using `require` because React is run on a Webpack server that doesn't have access to Node.js APIs directly with `require`, see: https://stackoverflow.com/a/44454923*/

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
