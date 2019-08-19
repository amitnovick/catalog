const selectFsResourcesInCategorySubtree = `
WITH categories_subtree AS (
  WITH RECURSIVE tc( i )  AS (
    SELECT id FROM categories WHERE id = $category_id
    UNION 
    SELECT id from categories, tc
    WHERE categories.parent_id = tc.i
  )
  SELECT categories.id FROM categories WHERE categories.id IN tc
),
  categorized_fs_resources AS (
    SELECT categories_fs_resources.fs_resource_id
    FROM categories_fs_resources
    WHERE categories_fs_resources.category_id IN categories_subtree
)
SELECT DISTINCT 
  fs_resources.id,
  fs_resources.name,
  fs_resource_types.name AS type
FROM fs_resources
INNER JOIN fs_resource_types
ON fs_resources.type_id = fs_resource_types.id
WHERE fs_resources.id IN categorized_fs_resources
`;

export default selectFsResourcesInCategorySubtree;
