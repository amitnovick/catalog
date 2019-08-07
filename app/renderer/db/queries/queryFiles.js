import getSqlDriver from '../sqlDriver';

const selectFiles = `
SELECT files.id, files.name
FROM files
INNER JOIN categories_files
ON files.id = categories_files.file_id
WHERE categories_files.category_id = $category_id
`;

const queryFiles = (categoryId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectFiles,
      {
        $category_id: categoryId,
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

export default queryFiles
