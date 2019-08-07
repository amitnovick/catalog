import getSqlDriver from './getSqlDriver';

const createFilesTableIfNotExists = `
CREATE TABLE IF NOT EXISTS files (
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  added_at TEXT NOT NULL
);
`;

const createCategoriesTableIfNotExists = `
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY,
  parent_id INTEGER,
  name TEXT UNIQUE NOT NULL,
  added_at TEXT NOT NULL,
  FOREIGN KEY(parent_id) REFERENCES categories(id)
);
`;

const createCategoriesFilesTableIfNotExists = `
CREATE TABLE IF NOT EXISTS categories_files (
  category_id INTEGER,
  file_id INTEGER,
  FOREIGN KEY(category_id) REFERENCES categories(id),
  FOREIGN KEY(file_id) REFERENCES files(id)
  PRIMARY KEY (category_id, file_id)
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
  name,
  added_at
)
SELECT NULL,"Root", datetime("now")
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
