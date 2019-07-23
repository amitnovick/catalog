import getSqlDriver from '../sqlDriver';
import { selectRootCategory } from '../sql_queries';

const queryRootCategory = () => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(selectRootCategory, (err, categoriesRows) => {
      if (err) {
        console.log('err:', err);
        reject();
      } else {
        const rootCategory = categoriesRows[0];
        resolve(rootCategory);
      }
    });
  });
};

export default queryRootCategory;
