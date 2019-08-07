import getSqlDriver from '../sqlDriver';

const selectCategoriesOfFile = `
SELECT categories.name, categories.id
FROM files
INNER JOIN categories_files
ON files.id = categories_files.file_id
INNER JOIN categories
ON categories.id = categories_files.category_id
WHERE files.id = $file_id
`;

const queryCategoriesOfFile = (fileId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectCategoriesOfFile,
      {
        $file_id: fileId,
      },
      (err, rows) => {
        if (err) {
          console.log('err:', err);
          reject();
        } else {
          resolve(rows);
        }
      },
    );
  });
};

export default queryCategoriesOfFile;
