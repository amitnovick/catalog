import getPersistentDbConnection from '../getPersistentDbConnection';

const selectCategoryAncestors = `
WITH RECURSIVE tc( i )  AS (
  SELECT categories.parent_id
  FROM categories
  INNER JOIN categories AS parent_categories
  ON categories.parent_id = parent_categories.id
  WHERE categories.id = $category_id
  UNION 
  SELECT parent_id FROM categories, tc
  WHERE categories.id = tc.i
  )
SELECT categories.id FROM categories WHERE categories.id IN tc
`;

const queryCategoryAncestors = (categoryId) => {
  return new Promise((resolve, reject) => {
    getPersistentDbConnection().all(
      selectCategoryAncestors,
      {
        $category_id: categoryId,
      },
      (err, rows) => {
        if (err) {
          reject(new Error(`Unknown error: ${err.message}`));
        } else {
          resolve(rows);
        }
      },
    );
  });
};

export default queryCategoryAncestors
