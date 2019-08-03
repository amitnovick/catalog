import formatFilePath from './formatFilePath';

const fs = require('fs');

const deleteFile = (fileName) =>
  new Promise((resolve, reject) => {
    const filePath = formatFilePath(fileName);
    fs.unlink(filePath, (err) => {
      if (err) {
        reject(new Error(`Unknown error: ${err}`));
      } else {
        console.log('The file has been deleted!');
        resolve();
      }
    });
  });

export default deleteFile;
