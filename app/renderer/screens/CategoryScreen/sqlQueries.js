export const selectCategoryNameAndParentId = `
SELECT categories.name, categories.parent_id
FROM categories
WHERE categories.id = $category_id
`;

export const updateCategoryName = `
UPDATE categories
SET name = $category_name
WHERE categories.id = $category_id
`;

export const deleteCategoryFromDb = `
DELETE FROM categories
WHERE categories.id = $category_id
`;

export const selectCategorizedFiles = `
SELECT files.id, files.name
FROM files
INNER JOIN categories_files
ON files.id = categories_files.file_id
WHERE categories_files.category_id = $category_id
`;
