import getSqlDriver from '../getSqlDriver';

const selectCountFiles = `
SELECT COUNT(*) AS count_of_files
FROM files
`;

const querySelectCountFiles = async () => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(selectCountFiles, (err, rows) => {
      if (err) {
        reject(new Error(`Unknown error: ${err.message}`));
      } else {
        if (rows.length === 0) {
          reject(new Error(`Unknown error: retrieved zero rows`));
        } else {
          const countRow = rows[0];
          const { count_of_files: countOfFiles } = countRow;
          resolve(countOfFiles);
        }
      }
    });
  });
};

export default querySelectCountFiles;
