const ncp = require('ncp').ncp;

const copyDirectory = (sourcePath, destinationPath) => {
  return new Promise((resolve, reject) => {
    ncp(sourcePath, destinationPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export default copyDirectory;
