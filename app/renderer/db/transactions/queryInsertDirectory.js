import createDbConnection from '../createDbConnection';

const insertDirectory = `
INSERT INTO fs_resources (
  name,
  type_id
)
SELECT $fs_resource_name, id
FROM fs_resource_types
WHERE fs_resource_types.name = "directory"
`;

const selectInsertedFsResourceId = `SELECT last_insert_rowid() AS id`;

const fsResourceNameAlreadyExistsErrorMessage =
  'SQLITE_CONSTRAINT: UNIQUE constraint failed: fs_resources.name';

const queryInsertDirectory = async (fsResourceName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await createDbConnection();
      await new Promise((resolve, reject) => {
        db.run('BEGIN TRANSACTION', (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      try {
        await new Promise((resolve, reject) => {
          db.run(
            insertDirectory,
            {
              $fs_resource_name: fsResourceName,
            },
            function(err) {
              if (err) {
                if (err.message === fsResourceNameAlreadyExistsErrorMessage) {
                  const errorMessage = 'Error: resource by that name already exists in db!';
                  reject(new Error(errorMessage));
                } else {
                  const errorMessage = `Unknown error: ${err.message}`;
                  reject(new Error(errorMessage));
                }
              } else {
                const { changes: affectedRowsCount } = this;
                if (affectedRowsCount !== 1) {
                  const errorMessage = `Unknown error: affected ${affectedRowsCount} rows, expected to affect 1 file row`;
                  reject(new Error(errorMessage));
                } else {
                  resolve();
                }
              }
            },
          );
        });
        const directoryId = await new Promise((resolve, reject) => {
          db.all(selectInsertedFsResourceId, (err, rows) => {
            if (err) {
              reject(err);
            } else {
              const insertedFileRow = rows[0];
              const { id: fileId } = insertedFileRow;
              resolve(fileId);
            }
          });
        });

        db.run('COMMIT');
        db.close();
        resolve(directoryId);
      } catch (error) {
        db.run('ROLLBACK');
        db.close();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export default queryInsertDirectory;
