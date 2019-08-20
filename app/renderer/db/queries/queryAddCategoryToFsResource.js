import getPersistentDbConnection from '../getPersistentDbConnection';

const insertCategoryOfFsResource = `
INSERT INTO categories_fs_resources
(category_id, fs_resource_id)
VALUES ($category_id, $fs_resource_id)`;

const categoryAlreadyExistsErrorMessage = `SQLITE_CONSTRAINT: UNIQUE constraint failed: categories_files.category_id, categories_files.file_id`;

const queryAddCategoryToFsResource = (fsResourceId, category) => {
  return new Promise((resolve, reject) => {
    getPersistentDbConnection().run(
      insertCategoryOfFsResource,
      {
        $category_id: category.id,
        $fs_resource_id: fsResourceId,
      },
      function(err) {
        if (err) {
          if (err.message === categoryAlreadyExistsErrorMessage) {
            const errorMessage = `Category ${category.name} already exists on file`;
            reject(new Error(errorMessage));
          } else {
            const errorMessage = `Unknown error:, ${err.message}`;
            reject(new Error(errorMessage));
          }
        } else {
          const { changes: affectedRowsCount } = this;
          if (affectedRowsCount !== 1) {
            reject(new Error('No affected rows error'));
          } else {
            resolve();
          }
        }
      },
    );
  });
};

export default queryAddCategoryToFsResource;
