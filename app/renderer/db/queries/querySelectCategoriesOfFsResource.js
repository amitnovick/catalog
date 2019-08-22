import getPersistentDbConnection from '../getPersistentDbConnection';

const selectCategoriesOfFsResource = `
SELECT categories.name, categories.id
FROM fs_resources
INNER JOIN categories_fs_resources
ON fs_resources.id = categories_fs_resources.fs_resource_id
INNER JOIN categories
ON categories.id = categories_fs_resources.category_id
WHERE fs_resources.id = $fs_resource_id
`;

const querySelectCategoriesOfFsResource = (fsResourceId) => {
  return new Promise((resolve, reject) => {
    getPersistentDbConnection().all(
      selectCategoriesOfFsResource,
      {
        $fs_resource_id: fsResourceId,
      },
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      },
    );
  });
};

export default querySelectCategoriesOfFsResource;
