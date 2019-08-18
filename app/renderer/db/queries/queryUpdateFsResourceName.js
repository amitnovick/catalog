import getSqlDriver from '../getSqlDriver';

const updateFsResourceName = `
UPDATE fs_resources
SET name = $fs_resource_name
WHERE fs_resources.id = $fs_resource_id
`;

const fsResourceNameAlreadyExistsErrorMessage = `SQLITE_CONSTRAINT: UNIQUE constraint failed: fs_resources.name`;

const queryUpdateFsResourceName = (fsResourceId, newFsResourceName) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      updateFsResourceName,
      {
        $fs_resource_name: newFsResourceName,
        $fs_resource_id: fsResourceId,
      },
      function(err) {
        if (err) {
          if (err.message === fsResourceNameAlreadyExistsErrorMessage) {
            reject(new Error(`Error: fs resource "${newFsResourceName}" already exists in db`));
          } else {
            reject(new Error(`Unknown error: ${err}`));
          }
        } else {
          const { changes: affectedRowsCount } = this;
          if (affectedRowsCount !== 1) {
            reject(
              new Error(
                `Unknown error: expected to affect 1 row, but affected ${affectedRowsCount} instead`,
              ),
            );
          } else {
            resolve();
          }
        }
      },
    );
  });
};

export default queryUpdateFsResourceName;
