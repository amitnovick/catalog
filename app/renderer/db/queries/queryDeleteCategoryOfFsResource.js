import getPersistentDbConnection from '../getPersistentDbConnection';

const deleteCategoryOfFsResource = `
DELETE FROM categories_fs_resources
WHERE categories_fs_resources.category_id = $category_id
AND categories_fs_resources.fs_resource_id = $fs_resource_id
`;

const queryDeleteCategoryOfFsResource = (categoryId, fsResourceId) => {
  return new Promise((resolve, reject) => {
    getPersistentDbConnection().run(
      deleteCategoryOfFsResource,
      {
        $category_id: categoryId,
        $fs_resource_id: fsResourceId,
      },
      function(err) {
        if (err) {
          console.log('unknown error:', err);
          reject();
        } else {
          const { changes: affectedRowsCount } = this;
          if (affectedRowsCount !== 1) {
            console.log('No affected rows error');
            reject();
          } else {
            resolve();
          }
        }
      },
    );
  });
};

export default queryDeleteCategoryOfFsResource;
