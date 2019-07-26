import getSqlDriver from '../sqlDriver';

const selectCategoriesWithMatchingName = `
SELECT categories.id, categories.name
FROM categories
WHERE categories.name LIKE $category_name
`;

const querySelectCategoriesWithMatchingName = (categoryName) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectCategoriesWithMatchingName,
      {
        $category_name: `%${categoryName}%`,
      },
      (err, categoriesRows) => {
        if (err) {
          console.log('err:', err);
          reject();
        } else {
          resolve(categoriesRows);
        }
      },
    );
  });
};

export default querySelectCategoriesWithMatchingName;
