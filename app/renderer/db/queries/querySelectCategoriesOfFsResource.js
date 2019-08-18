import getSqlDriver from '../getSqlDriver';

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
    getSqlDriver().all(
      selectCategoriesOfFsResource,
      {
        $fs_resource_id: fsResourceId,
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

export default querySelectCategoriesOfFsResource;
