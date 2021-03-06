import getPersistentDbConnection from '../getPersistentDbConnection';

const selectCategoriesInPath = `
WITH RECURSIVE tc( i, depth )  AS (
  SELECT id, 0 FROM categories WHERE id = $lowest_category_id
  UNION 
  SELECT parent_id, tc.depth + 1 FROM categories, tc
  WHERE categories.id = tc.i
  )
SELECT i AS id, (SELECT name FROM categories c WHERE c.id = tc.i) AS name FROM tc
WHERE tc.i IS NOT NULL
ORDER BY depth DESC
`;

const queryCategoriesInPath = (categoryId) => {
  return new Promise((resolve, reject) => {
    getPersistentDbConnection().all(
      selectCategoriesInPath,
      {
        $lowest_category_id: categoryId,
      },
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      },
    );
  });
};

export default queryCategoriesInPath;
