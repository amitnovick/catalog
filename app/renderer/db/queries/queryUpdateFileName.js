import getSqlDriver from '../sqlDriver';

const updateFileName = `
UPDATE files
SET name = $file_name
WHERE files.id = $file_id
`;

const fileNameAlreadyExistsErrorMessage = `SQLITE_CONSTRAINT: UNIQUE constraint failed: files.name`;

const queryUpdateFileName = (fileId, newFileName) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      updateFileName,
      {
        $file_name: newFileName,
        $file_id: fileId,
      },
      function(err) {
        if (err) {
          if (err.message === fileNameAlreadyExistsErrorMessage) {
            reject(new Error(`Error: file name ${newFileName} already exists in db`));
          } else {
            reject(new Error(`Unknown error: ${err}`));
          }
        } else {
          const { changes: affectedRowsCount } = this;
          if (affectedRowsCount !== 1) {
            reject(
              new Error(
                `Unknown error: expected to affect 1 row, but affected ${affectedRowsCount} instead`,
              ),
            );
          } else {
            resolve();
          }
        }
      },
    );
  });
};

export default queryUpdateFileName;
