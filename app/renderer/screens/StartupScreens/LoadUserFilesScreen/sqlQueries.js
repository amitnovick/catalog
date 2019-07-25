export const createFilesTableIfNotExists = `
CREATE TABLE IF NOT EXISTS files (
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);
`;

export const createCategoriesTableIfNotExists = `
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY,
  parent_id INTEGER,
  name TEXT UNIQUE NOT NULL,
  FOREIGN KEY(parent_id) REFERENCES categories(id)
);
`;

export const createCategoriesFilesTableIfNotExists = `
CREATE TABLE IF NOT EXISTS categories_files (
  category_id INTEGER,
  file_id INTEGER,
  FOREIGN KEY(category_id) REFERENCES categories(id),
  FOREIGN KEY(file_id) REFERENCES files(id)
  PRIMARY KEY (category_id, file_id)
);
`;

export const insertRootCategoryIfNotExists = `
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
