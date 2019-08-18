import createDbConnection from '../createDbConnection';

const insertFile = `
INSERT INTO fs_resources (
  name,
  type_id
)
SELECT $fs_resource_name, id
FROM fs_resource_types
WHERE fs_resource_types.name = "file"
`;

const selectInsertedFileId = `SELECT last_insert_rowid() AS id`;

const fileNameAlreadyExistsErrorMessage =
  'SQLITE_CONSTRAINT: UNIQUE constraint failed: fs_resources.name';

const queryInsertFile = async (fsResourceName) => {
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
            insertFile,
            {
              $fs_resource_name: fsResourceName,
            },
            function(err) {
              if (err) {
                if (err.message === fileNameAlreadyExistsErrorMessage) {
                  const errorMessage = 'Error: file already exists in db!';
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
        const fileId = await new Promise((resolve, reject) => {
          db.all(selectInsertedFileId, (err, rows) => {
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
        resolve(fileId);
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

export default queryInsertFile;
