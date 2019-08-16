const fs = require('fs');

const readJSONfile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const parsedData = JSON.parse(data);
        resolve(parsedData);
      }
    });
  });
};

export default readJSONfile;
