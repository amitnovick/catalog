import getSqlDriver from './getSqlDriver';

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
  category_id INTEGER,
  file_id INTEGER,

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

const buildSchema = () => {
  return new Promise((resolve, reject) => {
    getSqlDriver().serialize(function() {
      getSqlDriver().run(createFilesTableIfNotExists, function(err) {
        if (err) {
          reject();
        }
      });
      getSqlDriver().run(createWebClipResourcesIfNotExists, function(err) {
        if (err) {
          reject();
        }
      });
      getSqlDriver().run(createCategoriesTableIfNotExists, function(err) {
        if (err) {
          reject();
        }
      });
      getSqlDriver().run(createCategoriesFilesTableIfNotExists, function(err) {
        if (err) {
          reject();
        }
      });
      getSqlDriver().run(enableForeignKeySupport, function(err) {
        if (err) {
          reject();
        }
      });
      getSqlDriver().run(insertRootCategoryIfNotExists, {}, function(err) {
        if (err) {
          reject();
        } else {
          resolve();
        }
      });
    });
  });
};

export default buildSchema;
