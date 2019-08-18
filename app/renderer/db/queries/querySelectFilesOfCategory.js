import getSqlDriver from '../getSqlDriver';

const selectFilesOfCategory = `
SELECT fs_resources.id, fs_resources.name
FROM fs_resources
INNER JOIN categories_fs_resources
ON fs_resources.id = categories_fs_resources.fs_resource_id
WHERE categories_fs_resources.category_id = $category_id
AND fs_resources.type_id = (
  SELECT id
  FROM fs_resource_types
  WHERE fs_resource_types.name = "file"
)
ORDER BY fs_resources.added_at DESC
`;

const querySelectFilesOfCategory = (categoryId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectFilesOfCategory,
      {
        $category_id: categoryId,
      },
      (err, rows) => {
        if (err) {
          console.log('err:', err);
          reject();
        } else {
          resolve(rows);
        }
      },
    );
  });
};

export default querySelectFilesOfCategory;
