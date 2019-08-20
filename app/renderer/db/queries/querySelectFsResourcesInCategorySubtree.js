import getPersistentDbConnection from '../getPersistentDbConnection';
import selectFsResourcesInCategorySubtree from '../sql_fragments/selectFsResourcesInCategorySubtree';

const orderedSelectFsResourcesInCategorySubtree = `
${selectFsResourcesInCategorySubtree}
ORDER BY fs_resources.added_at DESC
`;

const querySelectFsResourcesInCategorySubtree = (category) => {
  return new Promise((resolve, reject) => {
    getPersistentDbConnection().all(
      orderedSelectFsResourcesInCategorySubtree,
      {
        $category_id: category.id,
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

export default querySelectFsResourcesInCategorySubtree;
