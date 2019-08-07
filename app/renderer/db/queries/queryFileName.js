import getSqlDriver from '../getSqlDriver';

const selectFileName = `
SELECT files.name
FROM files
WHERE files.id = $file_id
`;

const queryFileName = (fileId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectFileName,
      {
        $file_id: fileId,
      },
      (err, rows) => {
        if (err) {
          console.log('err:', err);
          reject();
        } else {
          const fileRow = rows[0];
          const { name: fileName } = fileRow;
          resolve(fileName);
        }
      },
    );
  });
};

export default queryFileName
