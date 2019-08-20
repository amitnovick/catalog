import getPersistentDbConnection from '../getPersistentDbConnection';

const selectCategorizedFsResources = `
SELECT fs_resources.id, fs_resources.name
FROM fs_resources
INNER JOIN categories_fs_resources
ON fs_resources.id = categories_fs_resources.fs_resource_id
WHERE categories_fs_resources.category_id = $category_id
`;

const queryCategorizedFsResources = (categoryId) => {
  return new Promise((resolve, reject) => {
    getPersistentDbConnection().all(
      selectCategorizedFsResources,
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

export default queryCategorizedFsResources;
