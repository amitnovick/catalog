const fs = require('fs');

const FILE_EXISTS_ERROR_CODE = 'EEXIST';

const writeFileIfNotExist = filePath => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, '', { flag: 'wx' }, err => {
      if (err) {
        if (err.code === FILE_EXISTS_ERROR_CODE) {
          reject();
        } else {
          console.log('unknown error occurred:', err);
          reject();
        }
      } else {
        console.log('The file has been saved!');
        resolve();
      }
    });
  });
};

export default writeFileIfNotExist;
