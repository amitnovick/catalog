const fs = require('fs');

/* Error objeect shape: 
  Should have key `code` 
  which may or may not equal 'EEXIST' */

const writeFileIfNotExist = (filePath, data = '') => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, { flag: 'wx' }, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log('The file has been saved!');
        resolve();
      }
    });
  });
};

export default writeFileIfNotExist;
