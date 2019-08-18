import getSqlDriver from '../getSqlDriver';

const selectCountFsResources = `
SELECT COUNT(*) AS count_of_fs_resources
FROM fs_resources
`;

const querySelectCountFsResources = async () => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(selectCountFsResources, (err, rows) => {
      if (err) {
        reject(new Error(`Unknown error: ${err.message}`));
      } else {
        if (rows.length === 0) {
          reject(new Error(`Unknown error: retrieved zero rows`));
        } else {
          const countRow = rows[0];
          const { count_of_fs_resources: countOfFsResources } = countRow;
          resolve(countOfFsResources);
        }
      }
    });
  });
};

export default querySelectCountFsResources;
