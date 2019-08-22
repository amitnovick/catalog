import getPersistentDbConnection from '../getPersistentDbConnection';

const selectFsResource = `
  SELECT 
    fs_resources.id,
    fs_resources.name,
    fs_resource_types.name AS type
  FROM fs_resources
  INNER JOIN fs_resource_types
  ON fs_resources.type_id = fs_resource_types.id
  WHERE fs_resources.id = $fs_resource_id
`;

const querySelectFsResource = (fsResourceId) => {
  return new Promise((resolve, reject) => {
    getPersistentDbConnection().all(
      selectFsResource,
      {
        $fs_resource_id: fsResourceId,
      },
      (err, rows) => {
        if (err) {
          const errorMessage = `Unexpected error: ${err.message}`;
          reject(new Error(errorMessage));
        } else {
          if (rows.length !== 1) {
            const errorMessage = `Expected to retrieve ${1} rows, but got ${rows.length} instead`;
            reject(new Error(errorMessage));
          } else {
            const fsResourceRow = rows[0];
            resolve(fsResourceRow);
          }
        }
      },
    );
  });
};

export default querySelectFsResource;
