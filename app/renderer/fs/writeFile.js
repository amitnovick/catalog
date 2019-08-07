import formatFilePath from './formatFilePath';
const fs = require('fs');

const writeFile = (fileName) =>
  new Promise((resolve, reject) => {
    const filePath = formatFilePath(fileName);
    fs.writeFile(filePath, '', { flag: 'wx' }, (err) => {
      if (err) {
        if (err.code === 'EEXIST') {
          const errorMessage = 'Error: file already exists on filesystem, did not overwrite';
          reject(new Error(errorMessage));
        } else {
          const errorMessage = `Unknown error occurred: ${err.message}`;
          reject(new Error(errorMessage));
        }
      } else {
        resolve(fileName);
      }
    });
  });

export default writeFile;
