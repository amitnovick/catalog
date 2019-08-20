import getPersistentDbConnection from '../getPersistentDbConnection';

const selectWebclipsCategory = `
  SELECT webclips_category.id, categories.name
  FROM webclips_category
  INNER JOIN categories
  ON webclips_category.id = categories.id
`;

const queryWebclipsCategory = () => {
  return new Promise((resolve, reject) => {
    getPersistentDbConnection().all(selectWebclipsCategory, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        if (rows.length > 0) {
          const webclipsCategory = rows[0];
          resolve(webclipsCategory);
        } else {
          resolve(null);
        }
      }
    });
  });
};

export default queryWebclipsCategory;
