import getSqlDriver from '../getSqlDriver';

const deleteCategoryOfFilesWhenMovingCategory = `
WITH files_categorized_by_parent AS (
  SELECT file_id
  FROM categories_files
  WHERE category_id = $parent_category_id
), files_categorized_by_child AS (
  SELECT file_id
  FROM categories_files
  WHERE category_id = $child_category_id
), files_categorized_by_both AS (
  SELECT file_id
  FROM files_categorized_by_parent
  INTERSECT
  SELECT file_id
  FROM files_categorized_by_child
)
DELETE FROM categories_files
WHERE category_id = $parent_category_id
AND file_id IN files_categorized_by_both
`;

const queryDeleteCategoryOfFilesWhenMovingCategory = (childCategoryId, parentCategoryId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      deleteCategoryOfFilesWhenMovingCategory,
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

export default queryDeleteCategoryOfFilesWhenMovingCategory;
