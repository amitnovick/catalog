const rimraf = require('rimraf');

const deleteDirectory = (directoryPath) => {
  return new Promise((resolve, reject) => {
    rimraf(directoryPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export default deleteDirectory;
