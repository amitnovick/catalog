const path = require('path');

const formatFilePathRaw = (filesSubdirPath, fileName) => {
  const filePath = path.join(filesSubdirPath, fileName);
  return filePath;
};

export default formatFilePathRaw;
