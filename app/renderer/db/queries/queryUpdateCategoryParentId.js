import getPersistentDbConnection from '../getPersistentDbConnection';

export const updateCategoryParentId = `
UPDATE categories
SET parent_id = $parent_category_id
WHERE id = $child_category_id
`;

const queryUpdateCategoryParentId = async (childCategoryId, parentCategoryId) => {
  return new Promise(async (resolve, reject) => {
    getPersistentDbConnection().run(
      updateCategoryParentId,
      {
        $child_category_id: childCategoryId,
        $parent_category_id: parentCategoryId,
      },
      function(err) {
        if (err) {
          reject(err);
        } else {
          const { changes: affectedRowsCount } = this;
          if (affectedRowsCount !== 1) {
            reject(new Error('Error: No affected rows'));
          } else {
            resolve();
          }
        }
      },
    );
  });
};

export default queryUpdateCategoryParentId;
