import formatFilePath from './formatFilePath';
const fs = require('fs');

const renameFsResourceInUserFiles = (oldFileName, newFileName) =>
  new Promise((resolve, reject) => {
    const oldFilePath = formatFilePath(oldFileName);
    const newFilePath = formatFilePath(newFileName);
    fs.rename(oldFilePath, newFilePath, (err) => {
      if (err) {
        reject(new Error(`Unknown error: ${err.message}`));
      } else {
        resolve();
      }
    });
  });

export default renameFsResourceInUserFiles;
