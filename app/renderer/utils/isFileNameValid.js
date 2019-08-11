const isValidFilename = require('valid-filename');

const isFileNameValid = (fileName) => {
  return isValidFilename(fileName) && fileName.trim() !== '';
};

export default isFileNameValid;
