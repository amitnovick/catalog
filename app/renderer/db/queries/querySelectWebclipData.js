import getPersistentDbConnection from '../getPersistentDbConnection';

const selectWebclipData = `
SELECT page_url, page_title
FROM webclip_resources
WHERE id = $fs_resource_id
`;

const querySelectWebclipData = (fsResourceId) => {
  return new Promise((resolve, reject) => {
    getPersistentDbConnection().all(
      selectWebclipData,
      {
        $fs_resource_id: fsResourceId,
      },
      (err, rows) => {
        if (err) {
          console.log('err:', err);
          reject(new Error(`Unknown error: ${err.message}`));
        } else {
          if (rows.length > 0) {
            const fsResourceRow = rows[0];
            const { page_url: pageUrl, page_title: pageTitle } = fsResourceRow;
            resolve({
              pageUrl,
              pageTitle,
            });
          } else {
            resolve(null);
          }
        }
      },
    );
  });
};

export default querySelectWebclipData;
