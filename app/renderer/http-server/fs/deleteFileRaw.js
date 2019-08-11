const fs = require('fs');

const deleteFileRaw = (filePath) =>
  new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        reject(new Error(`Unknown error: ${err}`));
      } else {
        console.log('The file has been deleted!');
        resolve();
      }
    });
  });

export default deleteFileRaw;
