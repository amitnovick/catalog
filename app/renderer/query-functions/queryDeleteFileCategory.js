import getSqlDriver from '../sqlDriver';
import { deleteCategoryOfFile } from '../sql_queries';

const queryDeleteFileCategory = (categoryId, fileId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      deleteCategoryOfFile,
      {
        $category_id: categoryId,
        $file_id: fileId,
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

export default queryDeleteFileCategory;
