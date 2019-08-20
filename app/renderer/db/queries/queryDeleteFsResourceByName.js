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
          console.log('Error: unknown error isnerting into db');
          reject();
        } else {
          const { changes: affectedRowsCount } = this;
          if (affectedRowsCount !== 1) {
            console.log("Error: couldn't delete file when trying to clean-up");
            reject();
          } else {
            console.log('Successfully deleted file from db when cleaning up');
            resolve();
          }
        }
      },
    );
  });
};

export default queryDeleteFsResourceByName;
