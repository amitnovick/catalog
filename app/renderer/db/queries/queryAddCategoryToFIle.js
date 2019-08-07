import getSqlDriver from '../sqlDriver';

const insertCategoryOfFile = `
INSERT INTO categories_files
(category_id, file_id)
VALUES ($category_id, $file_id)
`;

const categoryAlreadyExistsErrorMessage = `SQLITE_CONSTRAINT: UNIQUE constraint failed: categories_files.category_id, categories_files.file_id`;

const queryAddCategoryToFile = (fileId, category) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      insertCategoryOfFile,
      {
        $category_id: category.id,
        $file_id: fileId,
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

export default queryAddCategoryToFile;
