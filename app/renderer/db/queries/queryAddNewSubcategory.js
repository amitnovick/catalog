import getSqlDriver from '../getSqlDriver';

const insertCategory = `
INSERT INTO categories (
  parent_id,
  name,
  added_at
)
VALUES ($parent_category_id , $category_name, datetime("now"))
`;

const categoryNameAlreadyExistsErrorMessage =
  'SQLITE_CONSTRAINT: UNIQUE constraint failed: categories.name';

const queryAddNewSubcategory = async (parentCategoryId, categoryName) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      insertCategory,
      {
        $parent_category_id: parentCategoryId,
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

export default queryAddNewSubcategory;
