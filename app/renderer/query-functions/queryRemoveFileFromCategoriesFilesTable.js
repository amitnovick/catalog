import getSqlDriver from '../sqlDriver';

const deleteFileFromCategoriesFiles = `
DELETE FROM categories_files
WHERE categories_files.file_id = $file_id
`;

const queryRemoveFileFromCategoriesFilesTable = (fileId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      deleteFileFromCategoriesFiles,
      {
        $file_id: fileId,
      },
      function(err) {
        if (err) {
          console.log('unknown error:', err);
          reject();
        } else {
          resolve();
        }
      },
    );
  });
};

export default queryRemoveFileFromCategoriesFilesTable