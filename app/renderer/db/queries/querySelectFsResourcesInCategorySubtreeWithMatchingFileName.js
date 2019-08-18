import getSqlDriver from '../getSqlDriver';
import selectFsResourcesInCategorySubtree from '../sql_fragments/selectFsResourcesInCategorySubtree';

const selectFsResourcesInCategorySubtreeWithMatchingFileName = `
${selectFsResourcesInCategorySubtree}
AND fs_resources.name LIKE $fs_resource_name
ORDER BY fs_resources.added_at DESC
`;

const querySelectFsResourcesInCategorySubtreeWithMatchingFileName = (fsResourceName, category) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectFsResourcesInCategorySubtreeWithMatchingFileName,
      {
        $fs_resource_name: `%${fsResourceName}%`,
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

export default querySelectFsResourcesInCategorySubtreeWithMatchingFileName;
