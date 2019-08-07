import getSqlDriver from '../getSqlDriver';

const deleteCategoryFromDb = `
DELETE FROM categories
WHERE categories.id = $category_id
`;

const queryDeleteCategory = (categoryId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      deleteCategoryFromDb,
      {
        $category_id: categoryId,
      },
      function(err) {
        if (err) {
          console.log('unknown error:', err);
          reject();
        } else {
          const { changes: affectedRowsCount } = this;
          if (affectedRowsCount !== 1) {
            console.log('No affected rows error');
            reject();
          } else {
            resolve();
          }
        }
      },
    );
  });
};

export default queryDeleteCategory;
