import getSqlDriver from '../getSqlDriver';

const selectFsResourcesOfCategory = `
  SELECT fs_resources.id, fs_resources.name, fs_resource_types.name AS type
  FROM fs_resources
  INNER JOIN fs_resource_types
  ON fs_resources.type_id = fs_resource_types.id
  INNER JOIN categories_fs_resources
  ON fs_resources.id = categories_fs_resources.fs_resource_id
  WHERE categories_fs_resources.category_id = $category_id
  ORDER BY fs_resources.added_at DESC
`;

const querySelectFsResourcesOfCategory = (categoryId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectFsResourcesOfCategory,
      {
        $category_id: categoryId,
      },
      (err, rows) => {
        if (err) {
          console.log('err:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      },
    );
  });
};

export default querySelectFsResourcesOfCategory;
