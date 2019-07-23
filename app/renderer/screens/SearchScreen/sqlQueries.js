export const selectFilesByName = `
SELECT files.id, files.name
FROM files
WHERE files.name LIKE $file_name
`;

export const selectFilesUnderCategoryByName = `
WITH categories_subtree AS (
  WITH RECURSIVE tc( i )  AS (
    SELECT id FROM categories WHERE name = $category_name
    UNION 
    SELECT id from categories, tc
    WHERE categories.parent_id = tc.i
  )
  SELECT categories.id FROM categories WHERE categories.id IN tc
),
  categorized_files AS (
  SELECT categories_files.file_id
  FROM categories_files
  WHERE categories_files.category_id IN categories_subtree
)
SELECT DISTINCT files.id, files.name
FROM files
WHERE files.id IN categorized_files
AND files.name LIKE $file_name
`;
