import getSqlDriver from '../sqlDriver';

const selectChildCategories = `
SELECT child_categories.id, child_categories.name
FROM categories AS child_categories
INNER JOIN categories
ON child_categories.parent_id = categories.id
WHERE categories.id = $parent_category_id;
`;

const queryChildCategories = categoryId => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectChildCategories,
      {
        $parent_category_id: categoryId
      },
      (err, categoriesRows) => {
        if (err) {
          console.log('err:', err);
          reject();
        } else {
          resolve(categoriesRows);
        }
      }
    );
  });
};

export default queryChildCategories;
