import createDbConnection from '../createDbConnection';

const insertFile = `
INSERT INTO files (
  name
)
VALUES (
  $file_name
);
`;

const selectInsertedFileId = `SELECT last_insert_rowid() AS id`;

const fileNameAlreadyExistsErrorMessage = 'SQLITE_CONSTRAINT: UNIQUE constraint failed: files.name';

const queryInsertFile = async (fileName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await createDbConnection();
      db.serialize(function() {
        db.run('BEGIN TRANSACTION');
        db.run(
          insertFile,
          {
            $file_name: fileName,
          },
          function(err) {
            if (err) {
              db.run('ROLLBACK');
              db.close();
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
                db.run('ROLLBACK');
                db.close();
                const errorMessage = `Unknown error: affected ${affectedRowsCount} rows, expected to affect 1 file row`;
                reject(new Error(errorMessage));
              } else {
                db.all(selectInsertedFileId, (err, rows) => {
                  if (err) {
                    db.run('ROLLBACK');
                    db.close();
                    reject(err);
                  } else {
                    db.run('COMMIT');
                    db.close();
                    const insertedFileRow = rows[0];
                    const { id: fileId } = insertedFileRow;
                    resolve(fileId);
                  }
                });
              }
            }
          },
        );
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default queryInsertFile;
