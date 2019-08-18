import getSqlDriver from '../getSqlDriver';

const selectFsResourceName = `
SELECT name
FROM fs_resources
WHERE id = $fs_resource_id
`;

const querySelectFsResourceName = (fsResourceId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectFsResourceName,
      {
        $fs_resource_id: fsResourceId,
      },
      (err, rows) => {
        if (err) {
          console.log('err:', err);
          reject();
        } else {
          const fsResourceRow = rows[0];
          const { name: fsResourceName } = fsResourceRow;
          resolve(fsResourceName);
        }
      },
    );
  });
};

export default querySelectFsResourceName;
