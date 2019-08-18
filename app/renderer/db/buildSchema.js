import getSqlDriver from './getSqlDriver';
import createDbConnection from './createDbConnection';

const enableForeignKeySupport = `PRAGMA foreign_keys = ON`;

const selectFsResourceTypesTable = `
SELECT name
FROM sqlite_master
WHERE type = "table" 
AND name = "fs_resource_types"
LIMIT 1
`;

const createFsResourceTypesTable = `
CREATE TABLE fs_resource_types (
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
)
`;

const insertAllFsResourceTypes = `
  INSERT INTO fs_resource_types (
    name
  ) VALUES
  ( "file" ), ( "directory")
`;

const createFsResourcesTableIfNotExists = `
CREATE TABLE IF NOT EXISTS fs_resources (
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  added_at DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  type_id INTEGER NOT NULL,
  
  FOREIGN KEY (type_id)
  REFERENCES fs_resource_types (id)
  ON DELETE CASCADE
)
`;

const createWebClipResourcesIfNotExists = `
CREATE TABLE IF NOT EXISTS webclip_resources (
  id INTEGER,
  page_url TEXT NOT NULL,
  page_title TEXT NOT NULL,

  FOREIGN KEY (id)
  REFERENCES fs_resources (id)
  ON DELETE CASCADE,

  PRIMARY KEY (id)
);
`;

const createCategoriesTableIfNotExists = `
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY,
  parent_id INTEGER,
  name TEXT UNIQUE NOT NULL,
  added_at DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(parent_id)
  REFERENCES categories(id)
  ON DELETE CASCADE
);
`;

const createCategoriesFsResourcesTableIfNotExists = `
CREATE TABLE IF NOT EXISTS categories_fs_resources (
  category_id INTEGER NOT NULL,
  fs_resource_id INTEGER NOT NULL,

  FOREIGN KEY(category_id)
  REFERENCES categories(id)
  ON DELETE CASCADE,

  FOREIGN KEY(fs_resource_id)
  REFERENCES fs_resources(id)
  ON DELETE CASCADE,

  PRIMARY KEY (category_id, fs_resource_id)
);
`;

const insertRootCategoryIfNotExists = `
WITH existing_root AS (
  SELECT id
  FROM categories
  WHERE categories.parent_id IS NULL
  LIMIT 1
)
INSERT INTO categories (
  parent_id,
  name
)
SELECT NULL,"Root"
WHERE NOT EXISTS (SELECT 1 FROM existing_root);
`;

const selectWebclipsCategoryTable = `
SELECT name
FROM sqlite_master
WHERE type = "table" 
AND name = "webclips_category"
LIMIT 1
`;

const createWebclipsCategoryTable = `
CREATE TABLE webclips_category (
  id INTEGER,
  
  FOREIGN KEY (id)
  REFERENCES categories (id)
  ON DELETE CASCADE,

  PRIMARY KEY (id)
)
`;

const insertWebclipsCategoryToCategoriesTable = `
INSERT INTO categories (
  parent_id,
  name
)
SELECT categories.id, "WebClips"
FROM categories
WHERE categories.parent_id IS NULL
`;

const insertWebclipsCategoryToWebclipsCategoryTable = `
INSERT INTO webclips_category (
  id
)
VALUES (
  last_insert_rowid()
)
`;

const setupWebclipsNecessities = async () => {
  const db = await createDbConnection();
  db.run('BEGIN TRANSACTION');
  try {
    await new Promise((resolve, reject) => {
      db.run(createWebclipsCategoryTable, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    await new Promise((resolve, reject) => {
      db.run(insertWebclipsCategoryToCategoriesTable, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    await new Promise((resolve, reject) => {
      db.run(insertWebclipsCategoryToWebclipsCategoryTable, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    db.run('COMMIT');
    db.close();
    return Promise.resolve();
  } catch (error) {
    db.run('ROLLBACK');
    db.close();
    return Promise.reject(error);
  }
};

const buildSchema = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await new Promise((resolve, reject) => {
        getSqlDriver().run(enableForeignKeySupport, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      await new Promise((resolve, reject) => {
        getSqlDriver().all(selectFsResourceTypesTable, async function(err, rows) {
          if (err) {
            reject(err);
          } else {
            const rowsCount = rows.length;
            const doesFsResourceTypesTableExist = rowsCount > 0;
            if (doesFsResourceTypesTableExist) {
              resolve();
            } else {
              await new Promise((resolve, reject) => {
                getSqlDriver().run(createFsResourceTypesTable, function(err) {
                  if (err) {
                    reject(err);
                  } else {
                    resolve();
                  }
                });
              });

              await new Promise((resolve, reject) => {
                getSqlDriver().run(insertAllFsResourceTypes, function(err) {
                  if (err) {
                    reject(err);
                  } else {
                    resolve();
                  }
                });
              });

              resolve();
            }
          }
        });
      });

      await new Promise((resolve, reject) => {
        getSqlDriver().run(createFsResourcesTableIfNotExists, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      await new Promise((resolve, reject) => {
        getSqlDriver().run(createWebClipResourcesIfNotExists, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      await new Promise((resolve, reject) => {
        getSqlDriver().run(createCategoriesTableIfNotExists, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      await new Promise((resolve, reject) => {
        getSqlDriver().run(createCategoriesFsResourcesTableIfNotExists, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      await new Promise((resolve, reject) => {
        getSqlDriver().run(insertRootCategoryIfNotExists, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      await new Promise((resolve, reject) => {
        getSqlDriver().all(selectWebclipsCategoryTable, async function(err, rows) {
          if (err) {
            reject(err);
          } else {
            const rowsCount = rows.length;
            const doesWebclipsCategoryTableExist = rowsCount > 0;
            if (doesWebclipsCategoryTableExist) {
              resolve();
            } else {
              try {
                setupWebclipsNecessities();
                resolve();
              } catch (error) {
                reject(error);
              }
            }
          }
        });
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export default buildSchema;
