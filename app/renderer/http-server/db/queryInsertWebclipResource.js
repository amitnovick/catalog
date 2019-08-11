import getSqlDriver from '../../db/getSqlDriver';

const insertFile = `
INSERT INTO files (
  name
)
VALUES (
  $file_name
);
`;

const insertWebclipResource = `INSERT INTO webclip_resources ( id, page_url, page_title ) VALUES ( last_insert_rowid(), $page_url, $page_title )`;

const fileNameAlreadyExistsErrorMessage = 'SQLITE_CONSTRAINT: UNIQUE constraint failed: files.name';

const queryInsertWebclipResource = async (fileName, pageUrl, pageTitle) => {
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
              getSqlDriver().run('ROLLBACK');
              const errorMessage = `Unknown error: affected ${affectedRowsCount} rows, expected to affect 1 file row`;
              reject(new Error(errorMessage));
            } else {
              getSqlDriver().run(
                insertWebclipResource,
                {
                  $page_url: pageUrl,
                  $page_title: pageTitle,
                },
                (err) => {
                  getSqlDriver().run('COMMIT');
                  if (err) {
                    reject(err);
                  } else {
                    resolve();
                  }
                },
              );
            }
          }
        },
      );
    });
  });
};

export default queryInsertWebclipResource;
