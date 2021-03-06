import getPersistentDbConnection from '../getPersistentDbConnection';

const selectCategoryByName = `
SELECT categories.id
FROM categories
WHERE categories.name = $category_name
`;

const queryGetCategoryByName = (categoryName) => {
  return new Promise((resolve, reject) => {
    getPersistentDbConnection().all(
      selectCategoryByName,
      {
        $category_name: categoryName,
      },
      (err, categoriesRows) => {
        if (err) {
          reject(err);
        } else {
          if (categoriesRows.length === 0) {
            resolve(null);
          } else {
            const firstCategoryRow = categoriesRows[0];
            const categoryId = firstCategoryRow.id;
            resolve(categoryId);
          }
        }
      },
    );
  });
};

export default queryGetCategoryByName;
