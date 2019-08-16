import store from '../redux/store';

const sqlite3 = require('sqlite3');

const getSqliteFilePath = (store) =>
  store && store.startupScreen ? store.startupScreen.sqliteFilePath : null;

const createDbConnection = async () => {
  return new Promise((resolve, reject) => {
    const sqliteFilePath = getSqliteFilePath(store.getState());
    if (sqliteFilePath === null) {
      reject(new Error(`sqliteFilePath variable not present in store`));
    } else {
      const db = new sqlite3.Database(sqliteFilePath, (err) => {
        if (err === null) {
          resolve(db);
        } else {
          reject(err);
        }
      });
    }
  });
};

export default createDbConnection;
