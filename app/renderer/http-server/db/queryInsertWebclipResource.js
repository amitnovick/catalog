import getSqlDriver from '../../db/getSqlDriver';

const insertFile = `
INSERT INTO files (
  name
)
VALUES (
  $file_name
);
`;

const selectLastInsertRowId = `
  SELECT last_insert_rowid() AS id
`;

const insertWebclipResource = `
INSERT INTO webclip_resources (
  id, page_url, page_title 
)
VALUES (
  $file_id, $page_url, $page_title
)
`;

const assignWebclipsCategoryToFileIfCategoryExists = `
WITH existing_webclips_category AS (
  SELECT webclips_category.id
  FROM webclips_category
  LIMIT 1
)

INSERT INTO categories_files (
  category_id, file_id
)
SELECT id, $file_id
FROM existing_webclips_category
WHERE EXISTS (SELECT 1 FROM existing_webclips_category)
`;

const queryInsertWebclipResource = async (fileName, pageUrl, pageTitle) => {
  return new Promise(async (resolve, reject) => {
    try {
      await new Promise((resolve, reject) =>
        getSqlDriver().run('BEGIN TRANSACTION', (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }),
      );
      await new Promise((resolve, reject) => {
        getSqlDriver().run(
          insertFile,
          {
            $file_name: fileName,
          },
          function(err) {
            if (err) {
              reject(err);
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
        getSqlDriver().all(selectLastInsertRowId, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            if (rows.length === 0) {
              reject(
                new Error(
                  `Unexpected error: inserted file but last_insert_rowid() retrieved nothing`,
                ),
              );
            } else {
              const file = rows[0];
              resolve(file.id);
            }
          }
        });
      });
      await new Promise((resolve, reject) => {
        getSqlDriver().run(
          insertWebclipResource,
          {
            $file_id: fileId,
            $page_url: pageUrl,
            $page_title: pageTitle,
          },
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          },
        );
      });

      await new Promise((resolve, reject) => {
        getSqlDriver().run(
          assignWebclipsCategoryToFileIfCategoryExists,
          {
            $file_id: fileId,
          },
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          },
        );
      });

      await new Promise((resolve, reject) => {
        getSqlDriver().run('COMMIT', (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      resolve();
    } catch (error) {
      getSqlDriver().run('ROLLBACK');
      reject(error);
    }
  });
};

export default queryInsertWebclipResource;
