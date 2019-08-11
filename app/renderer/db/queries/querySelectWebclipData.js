import getSqlDriver from '../getSqlDriver';

const selectWebclipData = `
SELECT page_url, page_title
FROM webclip_resources
WHERE id = $file_id
`;

const querySelectWebclipData = (fileId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectWebclipData,
      {
        $file_id: fileId,
      },
      (err, rows) => {
        if (err) {
          console.log('err:', err);
          reject(new Error(`Unknown error: ${err.message}`));
        } else {
          if (rows.length > 0) {
            const fileRow = rows[0];
            const { page_url: pageUrl, page_title: pageTitle } = fileRow;
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
