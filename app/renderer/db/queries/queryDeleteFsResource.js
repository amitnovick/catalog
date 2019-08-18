import getSqlDriver from '../getSqlDriver';

const deleteFsResource = `
DELETE FROM fs_resources
WHERE fs_resources.id = $fs_resource_id
`;

const queryDeleteFsResource = (fsResourceId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      deleteFsResource,
      {
        $fs_resource_id: fsResourceId,
      },
      function(err) {
        if (err) {
          console.log('unknown error:', err);
          reject();
        } else {
          const { changes: affectedRowsCount } = this;
          if (affectedRowsCount !== 1) {
            console.log('queryDeleteFsResource: No affected rows error');
            reject();
          } else {
            resolve();
          }
        }
      },
    );
  });
};

export default queryDeleteFsResource;
