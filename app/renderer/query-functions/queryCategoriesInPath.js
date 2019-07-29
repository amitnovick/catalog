import getSqlDriver from '../sqlDriver';

const selectCategoriesInPath = `
WITH RECURSIVE tc( i )  AS (
  SELECT id FROM categories WHERE id = $lowest_category_id
  UNION 
  SELECT parent_id FROM categories, tc
  WHERE categories.id = tc.i
  )
SELECT id, name FROM categories WHERE categories.id IN tc;
`;

const queryCategoriesInPath = (categoryId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectCategoriesInPath,
      {
        $lowest_category_id: categoryId,
      },
      (err, rows) => {
        if (err) {
          console.log('err:', err);
          reject();
        } else {
          resolve(rows);
        }
      },
    );
  });
};

export default queryCategoriesInPath;
