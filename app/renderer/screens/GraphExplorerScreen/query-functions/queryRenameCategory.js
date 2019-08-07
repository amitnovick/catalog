import getSqlDriver from '../../../db/sqlDriver';

const updateCategoryName = `
UPDATE categories
SET name = $category_name
WHERE categories.id = $category_id
`;

const newCategoryNameAlreadyExistsErrorMessage = `SQLITE_CONSTRAINT: UNIQUE constraint failed: categories.name`;

const queryRenameCategory = (categoryId, newCategoryName) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      updateCategoryName,
      {
        $category_id: categoryId,
        $category_name: newCategoryName,
      },
      function(err) {
        if (err) {
          if (err.message === newCategoryNameAlreadyExistsErrorMessage) {
            reject(new Error('Category name is taken by another category'));
          } else {
            reject(new Error(`Unknown error: ${err.message}`));
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

export default queryRenameCategory;
