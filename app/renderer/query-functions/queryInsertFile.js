import getSqlDriver from '../sqlDriver';

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
  return new Promise((resolve, reject) => {
    getSqlDriver().serialize(function() {
      getSqlDriver().run('BEGIN TRANSACTION');
      getSqlDriver().run(
        insertFile,
        {
          $file_name: fileName,
        },
        function(err) {
          if (err) {
            getSqlDriver().run('ROLLBACK');
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
              getSqlDriver().all(selectInsertedFileId, (err, rows) => {
                getSqlDriver().run('COMMIT');
                if (err) {
                  reject(err);
                } else {
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
  });
};

export default queryInsertFile;
