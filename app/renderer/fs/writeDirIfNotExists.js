const fs = require('fs');

const DIR_EXISTS_ERROR_CODE = 'EEXIST';

const writeDirIfNotExists = (dirPath) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dirPath, { recursive: false }, (err) => {
      if (err) {
        if (err.code === DIR_EXISTS_ERROR_CODE) {
          resolve();
        } else {
          reject();
        }
      } else {
        resolve();
      }
    });
  });
};

export default writeDirIfNotExists;
