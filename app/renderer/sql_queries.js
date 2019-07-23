export const selectParentCategories = `
SELECT parent_categories.id, parent_categories.name 
FROM categories AS parent_categories
INNER JOIN categories
ON parent_categories.id = categories.parent_id
WHERE categories.id = $category_id;
`;

export const selectChildCategories = `
SELECT child_categories.id, child_categories.name
FROM categories AS child_categories
INNER JOIN categories
ON child_categories.parent_id = categories.id
WHERE categories.id = $parent_category_id;
`;

export const selectRootCategory = `
SELECT categories.id, categories.name
FROM categories
WHERE categories.parent_id IS NULL
LIMIT 1;
`;

export const insertCategory = `
INSERT INTO categories (
  parent_id,
  name
)
SELECT categories.id , $category_name
FROM categories
WHERE categories.parent_id IS NULL;
;
`;

export const updateRelationship = `
UPDATE categories
SET parent_id = (
  SELECT parent_categories.id
  FROM categories AS parent_categories
  WHERE parent_categories.name = $parent_name
)
WHERE categories.name = $child_name
`;

export const insertFile = `
INSERT INTO files (
  name
)
VALUES (
  $file_name
);
`;

export const deleteFileByName = `
DELETE FROM files 
WHERE files.name = $file_name
`;

export const selectFileName = `
SELECT files.name
FROM files
WHERE files.id = $file_id
`;

export const selectFiles = `
SELECT files.id, files.name
FROM files
INNER JOIN categories_files
ON files.id = categories_files.file_id
WHERE categories_files.category_id = $category_id
`;

export const selectCategoriesOfFile = `
SELECT categories.name, categories.id
FROM files
INNER JOIN categories_files
ON files.id = categories_files.file_id
INNER JOIN categories
ON categories.id = categories_files.category_id
WHERE files.id = $file_id
`;

export const insertCategoryOfFile = `
INSERT INTO categories_files
(category_id, file_id)
VALUES ($category_id, $file_id)
`;

export const selectCategoryByName = `
SELECT categories.id
FROM categories
WHERE categories.name = $category_name
`;

export const selectCategoryAncestors = `
WITH RECURSIVE tc( i )  AS (
  SELECT categories.parent_id
  FROM categories
  INNER JOIN categories AS parent_categories
  ON categories.parent_id = parent_categories.id
  WHERE categories.id = $category_id
  UNION 
  SELECT parent_id FROM categories, tc
  WHERE categories.id = tc.i
  )
SELECT categories.id FROM categories WHERE categories.id IN tc
`;

export const deleteCategoryOfFile = `
DELETE FROM categories_files
WHERE categories_files.category_id = $category_id
AND categories_files.file_id = $file_id
`;

export const updateFileName = `
UPDATE files
SET name = $file_name
WHERE files.id = $file_id
`;

export const deleteFileFromFiles = `
DELETE FROM files
WHERE files.id = $file_id
`;

export const deleteFileFromCategoriesFiles = `
DELETE FROM categories_files
WHERE categories_files.file_id = $file_id
`;
