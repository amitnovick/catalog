import getPersistentDbConnection from '../getPersistentDbConnection';

const selectFsResourcesByName = `
SELECT 
  fs_resources.id,
  fs_resources.name,
  fs_resource_types.name AS type
FROM fs_resources
INNER JOIN fs_resource_types
ON fs_resources.type_id = fs_resource_types.id
WHERE fs_resources.name LIKE $fs_resource_name
ORDER BY fs_resources.added_at DESC
`;

const querySelectFsResourcesWithMatchingName = async (fsResourceName) => {
  return new Promise((resolve, reject) => {
    getPersistentDbConnection().all(
      selectFsResourcesByName,
      {
        $fs_resource_name: `%${fsResourceName}%`,
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

export default querySelectFsResourcesWithMatchingName;
