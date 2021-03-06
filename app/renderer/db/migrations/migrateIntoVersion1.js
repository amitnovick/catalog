const updateUserVersion = (userVersion) => `
  PRAGMA user_version = ${userVersion}
`;

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

const setupWebclipsNecessities = (db) => {
  return new Promise(async (resolve, reject) => {
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
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

const migrateIntoVersion1 = (db, currentDbVersion) => {
  return new Promise(async (resolve, reject) => {
    try {
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
          db.all(selectFsResourceTypesTable, async function(err, rows) {
            if (err) {
              reject(err);
            } else {
              const rowsCount = rows.length;
              const doesFsResourceTypesTableExist = rowsCount > 0;
              if (doesFsResourceTypesTableExist) {
                resolve();
              } else {
                await new Promise((resolve, reject) => {
                  db.run(createFsResourceTypesTable, function(err) {
                    if (err) {
                      reject(err);
                    } else {
                      resolve();
                    }
                  });
                });

                await new Promise((resolve, reject) => {
                  db.run(insertAllFsResourceTypes, function(err) {
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
          db.run(createFsResourcesTableIfNotExists, function(err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });

        await new Promise((resolve, reject) => {
          db.run(createWebClipResourcesIfNotExists, function(err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });

        await new Promise((resolve, reject) => {
          db.run(createCategoriesTableIfNotExists, function(err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });

        await new Promise((resolve, reject) => {
          db.run(createCategoriesFsResourcesTableIfNotExists, function(err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });

        await new Promise((resolve, reject) => {
          db.run(insertRootCategoryIfNotExists, function(err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });

        await new Promise((resolve, reject) => {
          db.all(selectWebclipsCategoryTable, async function(err, rows) {
            if (err) {
              reject(err);
            } else {
              const rowsCount = rows.length;
              const doesWebclipsCategoryTableExist = rowsCount > 0;
              if (doesWebclipsCategoryTableExist) {
                resolve();
              } else {
                try {
                  await setupWebclipsNecessities(db);
                  resolve();
                } catch (error) {
                  reject(error);
                }
              }
            }
          });
        });

        await new Promise((resolve, reject) => {
          db.run(updateUserVersion(currentDbVersion + 1), (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });

        db.run('COMMIT');
        resolve();
      } catch (error) {
        db.run('ROLLBACK');
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export default migrateIntoVersion1;
