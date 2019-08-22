import getPersistentDbConnection from '../getPersistentDbConnection';

const deleteFsResourceByName = `
DELETE FROM fs_resources 
WHERE fs_resources.name = $fs_resource_name
`;

const queryDeleteFsResourceByName = async (fsResourceName) => {
  return new Promise((resolve, reject) => {
    getPersistentDbConnection().run(
      deleteFsResourceByName,
      {
        $fs_resource_name: fsResourceName,
      },
      function(err) {
        /* Must be non-arrow function, since `this` is used*/
        if (err) {
          reject(err);
        } else {
          const { changes: affectedRowsCount } = this;
          if (affectedRowsCount !== 1) {
            reject(
              new Error(
                `Expected to affect ${1} rows, but affected ${affectedRowsCount} rows instead`,
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

export default queryDeleteFsResourceByName;
