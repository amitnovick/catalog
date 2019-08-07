import getSqlDriver from '../sqlDriver';

const insertCategory = `
INSERT INTO categories (
  parent_id,
  name,
  added_at
)
SELECT categories.id , $category_name, datetime("now")
FROM categories
WHERE categories.parent_id IS NULL;
;
`;

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
