import getSqlDriver from '../getSqlDriver';

const selectPaginatedFsResources = `
SELECT 
  fs_resources.id,
  fs_resources.name,
  fs_resources.added_at,
  fs_resource_types.name AS type
FROM fs_resources
INNER JOIN fs_resource_types
ON fs_resources.type_id = fs_resource_types.id
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
