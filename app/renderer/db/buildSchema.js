import getPersistentDbConnection from './getPersistentDbConnection';
import latestDbVersion from './latestDbVersion';
import migrateIntoVersion1 from './migrations/migrateIntoVersion1';

const enableForeignKeySupport = `PRAGMA foreign_keys = ON`;

const selectUserVersion = `PRAGMA user_version`;

const isConsecutiveArray = (numbers) => {
  return numbers.every((currentNumber, i) => {
    if (i === 0) {
      return true;
    } else {
      const previousNumber = numbers[i - 1];
      const difference = currentNumber - previousNumber;
      return difference === 1;
    }
  });
};

const buildSchema = () => {
  return new Promise(async (resolve, reject) => {
    let dbMigrationsStack = [];

    try {
      await new Promise((resolve, reject) => {
        getPersistentDbConnection().run(enableForeignKeySupport, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      const foundDbVersion = await new Promise((resolve, reject) => {
        getPersistentDbConnection().all(selectUserVersion, function(err, rows) {
          if (err) {
            reject(err);
          } else {
            if (rows.length !== 1) {
              reject(
                new Error(
                  `Unexpected error: selectDbVersion: expected single row, got ${rows.length} rows instead`,
                ),
              );
            } else {
              const userVersionRow = rows[0];
              const { user_version: dbVersion } = userVersionRow;
              resolve(dbVersion);
            }
          }
        });
      });

      dbMigrationsStack.push(foundDbVersion);

      if (dbMigrationsStack[dbMigrationsStack.length - 1] === 0) {
        const currentDbVersion = dbMigrationsStack[dbMigrationsStack.length - 1];
        await migrateIntoVersion1(getPersistentDbConnection(), currentDbVersion);
        dbMigrationsStack.push(currentDbVersion + 1);
      }

      if (dbMigrationsStack[dbMigrationsStack.length - 1] !== latestDbVersion) {
        reject(
          new Error(
            `Current db version should match latest, but doesn't: current: ${
              dbMigrationsStack[dbMigrationsStack.length - 1]
            }, latest: ${latestDbVersion}`,
          ),
        );
      }

      if (isConsecutiveArray(dbMigrationsStack) === false) {
        reject(new Error(`Migrations stack is not a consecutive series: ${dbMigrationsStack}`));
      }

      console.info('Finished db schema verification. db migrations stack:', dbMigrationsStack);
      resolve();
    } catch (error) {
      console.log(
        `Error while building schema: migrations stack: ${dbMigrationsStack}, error stack: ${error}`,
      );
      reject(error);
    }
  });
};

export default buildSchema;
