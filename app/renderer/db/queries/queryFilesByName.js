import getSqlDriver from '../getSqlDriver';

const selectFilesByName = `
SELECT files.id, files.name
FROM files
WHERE files.name LIKE $file_name
ORDER BY files.added_at DESC
`;

const queryFilesByName = async (fileName) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectFilesByName,
      {
        $file_name: `%${fileName}%`,
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

export default queryFilesByName;
