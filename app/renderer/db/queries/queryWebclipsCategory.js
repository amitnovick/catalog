import getSqlDriver from '../getSqlDriver';

const selectWebclipsCategory = `
  SELECT webclips_category.id, categories.name
  FROM webclips_category
  INNER JOIN categories
  ON webclips_category.id = categories.id
`;

const queryWebclipsCategory = () => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(selectWebclipsCategory, (err, rows) => {
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
