import getSqlDriver from './getSqlDriver';
import createDbConnection from './createDbConnection';

const createFilesTableIfNotExists = `
CREATE TABLE IF NOT EXISTS files (
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  added_at DATE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

const createWebClipResourcesIfNotExists = `
CREATE TABLE IF NOT EXISTS webclip_resources (
  id INTEGER,
  page_url TEXT NOT NULL,
  page_title TEXT NOT NULL,

  FOREIGN KEY (id)
  REFERENCES files (id)
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

const createCategoriesFilesTableIfNotExists = `
CREATE TABLE IF NOT EXISTS categories_files (
  category_id INTEGER NOT NULL,
  file_id INTEGER NOT NULL,

  FOREIGN KEY(category_id)
  REFERENCES categories(id)
  ON DELETE CASCADE,

  FOREIGN KEY(file_id)
  REFERENCES files(id)
  ON DELETE CASCADE,

  PRIMARY KEY (category_id, file_id)
);
`;

const enableForeignKeySupport = `PRAGMA foreign_keys = ON`;

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

const insertWebclipsCategoryToCategories = `
INSERT INTO categories (
  parent_id,
  name
)
SELECT categories.id, "WebClips"
FROM categories
WHERE categories.parent_id IS NULL
`;

const insertWebclipsCategoryToWebclipsCategory = `
INSERT INTO webclips_category (
  id
)
VALUES (
  last_insert_rowid()
)
`;

const buildSchema = () => {
  return new Promise((resolve, reject) => {
    getSqlDriver().serialize(function() {
      getSqlDriver().run(createFilesTableIfNotExists, function(err) {
        if (err) {
          reject(err);
        }
      });
      getSqlDriver().run(createWebClipResourcesIfNotExists, function(err) {
        if (err) {
          reject(err);
        }
      });
      getSqlDriver().run(createCategoriesTableIfNotExists, function(err) {
        if (err) {
          reject(err);
        }
      });
      getSqlDriver().run(createCategoriesFilesTableIfNotExists, function(err) {
        if (err) {
          reject(err);
        }
      });
      getSqlDriver().run(enableForeignKeySupport, function(err) {
        if (err) {
          reject(err);
        }
      });
      getSqlDriver().run(insertRootCategoryIfNotExists, function(err) {
        if (err) {
          reject(err);
        }
      });
      getSqlDriver().all(selectWebclipsCategoryTable, async function(err, rows) {
        if (err) {
          reject(err);
        } else {
          const rowsCount = rows.length;
          if (rowsCount === 0) {
            try {
              const db = await createDbConnection();
              db.serialize(function() {
                db.run('BEGIN TRANSACTION');
                try {
                  db.run(createWebclipsCategoryTable, function(err) {
                    if (err) {
                      throw err;
                    }
                  });
                  db.run(insertWebclipsCategoryToCategories, function(err) {
                    if (err) {
                      throw err;
                    }
                  });
                  db.run(insertWebclipsCategoryToWebclipsCategory, function(err) {
                    if (err) {
                      throw err;
                    } else {
                      db.run('COMMIT');
                      db.close();
                      resolve();
                    }
                  });
                } catch (error) {
                  db.run('ROLLBACK');
                  db.close();
                  reject(error);
                }
              });
            } catch (error) {
              throw error;
            }
          } else {
            resolve();
          }
        }
      });
    });
  });
};

export default buildSchema;
