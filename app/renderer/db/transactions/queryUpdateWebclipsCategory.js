import createDbConnection from '../createDbConnection';

const deleteWebclipsCategoryIfExists = `
  DELETE FROM webclips_category
`;

const insertWebclipsCategory = `
  INSERT INTO webclips_category (
    id
  ) VALUES (
    $category_id
  )
`;

const queryUpdateWebclipsCategory = (category) => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await createDbConnection();
      await new Promise((resolve, reject) => {
        db.run('BEGIN TRANSACTION', (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      try {
        await new Promise((resolve, reject) => {
          db.run(deleteWebclipsCategoryIfExists, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
        await new Promise((resolve, reject) => {
          db.run(
            insertWebclipsCategory,
            {
              $category_id: category.id,
            },
            (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            },
          );
        });
        db.run('COMMIT');
        db.close();
        resolve();
      } catch (error) {
        db.run('ROLLBACK');
        db.close();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export default queryUpdateWebclipsCategory;
