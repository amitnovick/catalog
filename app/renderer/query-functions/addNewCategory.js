import getSqlDriver from '../sqlDriver';
import { insertCategory } from '../sql_queries';

const categoryNameAlreadyExistsErrorMessage =
  'SQLITE_CONSTRAINT: UNIQUE constraint failed: categories.name';

const addNewCategory = async (categoryName) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      insertCategory,
      {
        $category_name: categoryName,
      },
      function(err) {
        if (err) {
          if (err.message === categoryNameAlreadyExistsErrorMessage) {
            const error = new Error('Category name already exists!');
            reject(error);
          } else {
            reject(err);
          }
        } else {
          const { changes: affectedRowsCount } = this;
          if (affectedRowsCount !== 1) {
            const error = new Error('Failed to add the category');
            reject(error);
          } else {
            resolve();
          }
        }
      },
    );
  });
};

export default addNewCategory;
