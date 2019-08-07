import getSqlDriver from '../sqlDriver';

const deleteFileByName = `
DELETE FROM files 
WHERE files.name = $file_name
`;

const queryDeleteFile = async (fileName) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      deleteFileByName,
      {
        $file_name: fileName,
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

export default queryDeleteFile;
