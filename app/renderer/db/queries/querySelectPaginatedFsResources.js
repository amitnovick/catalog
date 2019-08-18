import getSqlDriver from '../getSqlDriver';

const selectPaginatedFsResources = `
SELECT id, name, added_at
FROM fs_resources
ORDER BY added_at DESC
LIMIT  $items_per_page
OFFSET ($current_page_number - 1) * $items_per_page
`;

const querySelectPaginatedFsResources = async (pageNumber, itemsPerPage) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectPaginatedFsResources,
      {
        $items_per_page: itemsPerPage,
        $current_page_number: pageNumber,
      },
      (err, rows) => {
        if (err) {
          reject(new Error(`Unknown error: ${err.message}`));
        } else {
          resolve(rows);
        }
      },
    );
  });
};

export default querySelectPaginatedFsResources;
