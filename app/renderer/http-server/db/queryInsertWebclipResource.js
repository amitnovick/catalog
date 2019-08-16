import getSqlDriver from '../../db/getSqlDriver';

const insertFile = `
INSERT INTO files (
  name
)
VALUES (
  $file_name
);
`;

const insertWebclipResource = `
INSERT INTO webclip_resources (
  id, page_url, page_title 
)
VALUES (
  last_insert_rowid(), $page_url, $page_title
)
`;

const fileNameAlreadyExistsErrorMessage = 'SQLITE_CONSTRAINT: UNIQUE constraint failed: files.name';

const queryInsertWebclipResource = async (fileName, pageUrl, pageTitle) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().serialize(function() {
      getSqlDriver().run('BEGIN TRANSACTION');
      try {
        getSqlDriver().run(
          insertFile,
          {
            $file_name: fileName,
          },
          function(err) {
            if (err) {
              throw err;
            } else {
              const { changes: affectedRowsCount } = this;
              if (affectedRowsCount !== 1) {
                const errorMessage = `Unknown error: affected ${affectedRowsCount} rows, expected to affect 1 file row`;
                throw new Error(errorMessage);
              } else {
                getSqlDriver().run(
                  insertWebclipResource,
                  {
                    $page_url: pageUrl,
                    $page_title: pageTitle,
                  },
                  (err) => {
                    if (err) {
                      throw err;
                    } else {
                      getSqlDriver().run('COMMIT');
                      resolve();
                    }
                  },
                );
              }
            }
          },
        );
      } catch (error) {
        getSqlDriver().run('ROLLBACK');
        reject(error);
      }
    });
  });
};

export default queryInsertWebclipResource;
