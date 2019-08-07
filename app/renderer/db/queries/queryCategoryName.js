import getSqlDriver from '../getSqlDriver';
import { selectCategoryNameAndParentId } from '../screens/CategoryScreen/sqlQueries';

const queryCategoryNameAndParentId = categoryId => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectCategoryNameAndParentId,
      {
        $category_id: categoryId
      },
      (err, rows) => {
        if (err) {
          console.log('err:', err);
          reject();
        } else {
          const categoryRow = rows[0];
          resolve(categoryRow);
        }
      }
    );
  });
};

export default queryCategoryNameAndParentId;
