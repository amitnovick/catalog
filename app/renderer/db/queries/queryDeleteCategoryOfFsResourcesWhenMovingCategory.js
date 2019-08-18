import getSqlDriver from '../getSqlDriver';

const deleteCategoryOfFsResourcesWhenMovingCategory = `
WITH fs_resources_categorized_by_parent AS (
  SELECT fs_resource_id
  FROM categories_fs_resources
  WHERE category_id = $parent_category_id
), fs_resources_categorized_by_child AS (
  SELECT fs_resource_id
  FROM categories_fs_resources
  WHERE category_id = $child_category_id
), fs_resources_categorized_by_both AS (
  SELECT fs_resource_id
  FROM fs_resources_categorized_by_parent
  INTERSECT
  SELECT fs_resource_id
  FROM fs_resources_categorized_by_child
)
DELETE FROM categories_fs_resources
WHERE category_id = $parent_category_id
AND fs_resource_id IN fs_resources_categorized_by_both
`;

const queryDeleteCategoryOfFsResourcesWhenMovingCategory = (childCategoryId, parentCategoryId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      deleteCategoryOfFsResourcesWhenMovingCategory,
      {
        $parent_category_id: parentCategoryId,
        $child_category_id: childCategoryId,
      },
      function(err) {
        if (err) {
          reject(new Error(`Unknown error: ${err.message}`));
        } else {
          resolve();
        }
      },
    );
  });
};

export default queryDeleteCategoryOfFsResourcesWhenMovingCategory;
