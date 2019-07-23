import { selectChildCategories } from '../sql_queries';
import getSqlDriver from '../sqlDriver';

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
