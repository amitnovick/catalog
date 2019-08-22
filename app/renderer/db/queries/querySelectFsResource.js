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

export const errorCodes = {
  SQL_ERROR: Symbol('SQL_ERROR'),
  UNEXPECTED_ROWS_NUMBER: Symbol('UNEXPECTED_ROWS_NUMBER'),
};

const querySelectFsResource = (fsResourceId) => {
  return new Promise((resolve, reject) => {
    getPersistentDbConnection().all(
      selectFsResource,
      {
        $fs_resource_id: fsResourceId,
      },
      (err, rows) => {
        if (err) {
          const error = new Error(`Unexpected error: ${err.message}`);
          error.code = errorCodes.SQL_ERROR;
          reject(error);
        } else {
          if (rows.length !== 1) {
            const error = new Error(
              `Expected to retrieve ${1} rows, but got ${rows.length} instead`,
            );
            error.code = errorCodes.UNEXPECTED_ROWS_NUMBER;
            reject(new Error(error));
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
