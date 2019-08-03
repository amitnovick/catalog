const fs = require('fs');

const copyFile = (sourcePath, destinationPath) => {
  return new Promise((resolve, reject) => {
    fs.copyFile(sourcePath, destinationPath, fs.constants.COPYFILE_EXCL, (err) => {
      if (err) {
        reject();
      } else {
        resolve();
      }
    });
  });
};

export default copyFile;
