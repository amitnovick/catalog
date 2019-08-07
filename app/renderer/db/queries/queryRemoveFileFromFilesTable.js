import getSqlDriver from '../sqlDriver';

const deleteFileFromFiles = `
DELETE FROM files
WHERE files.id = $file_id
`;

const queryRemoveFileFromFilesTable = (fileId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      deleteFileFromFiles,
      {
        $file_id: fileId,
      },
      function(err) {
        if (err) {
          console.log('unknown error:', err);
          reject();
        } else {
          const { changes: affectedRowsCount } = this;
          if (affectedRowsCount !== 1) {
            console.log('queryRemoveFileFromFilesTable: No affected rows error');
            reject();
          } else {
            resolve();
          }
        }
      },
    );
  });
};

export default queryRemoveFileFromFilesTable;
