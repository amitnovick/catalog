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

const selectLastInsertRowId = `
  SELECT last_insert_rowid() AS id
`;

const insertWebclipResource = `
INSERT INTO webclip_resources (
  id, page_url, page_title 
)
VALUES (
  $fs_resource_id, $page_url, $page_title
)
`;

const assignWebclipsCategoryToFileIfCategoryExists = `
WITH existing_webclips_category AS (
  SELECT webclips_category.id
  FROM webclips_category
  LIMIT 1
)

INSERT INTO categories_fs_resources (
  category_id, fs_resource_id
)
SELECT id, $fs_resource_id
FROM existing_webclips_category
WHERE EXISTS (SELECT 1 FROM existing_webclips_category)
`;

const queryInsertWebclipFile = async (fileName, pageUrl, pageTitle) => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await createDbConnection();
      try {
        await new Promise((resolve, reject) =>
          db.run('BEGIN TRANSACTION', (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }),
        );
        await new Promise((resolve, reject) => {
          db.run(
            insertFile,
            {
              $fs_resource_name: fileName,
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
          db.all(selectLastInsertRowId, (err, rows) => {
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
          db.run(
            insertWebclipResource,
            {
              $fs_resource_id: fileId,
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
          db.run(
            assignWebclipsCategoryToFileIfCategoryExists,
            {
              $fs_resource_id: fileId,
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
          db.run('COMMIT', (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
        db.close();
        resolve();
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

export default queryInsertWebclipFile;
