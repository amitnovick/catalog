import getPersistentDbConnection from '../getPersistentDbConnection';

const deleteFsResource = `
DELETE FROM fs_resources
WHERE fs_resources.id = $fs_resource_id
`;

const queryDeleteFsResource = (fsResourceId) => {
  return new Promise((resolve, reject) => {
    getPersistentDbConnection().run(
      deleteFsResource,
      {
        $fs_resource_id: fsResourceId,
      },
      function(err) {
        if (err) {
          const errorMessage = `Unexpected error: queryDeleteFsResource: ${err.message}`;
          reject(new Error(errorMessage));
        } else {
          const { changes: affectedRowsCount } = this;
          if (affectedRowsCount !== 1) {
            const errorMessage = 'queryDeleteFsResource: No affected rows error';
            reject(new Error(errorMessage));
          } else {
            resolve();
          }
        }
      },
    );
  });
};

export default queryDeleteFsResource;
