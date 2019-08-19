import deleteFile from './deleteFile';
import formatFilePath from './formatFilePath';

const deleteFileFromUserFiles = (filePath) => {
  const absolutePathInUserFiles = formatFilePath(filePath);
  return deleteFile(absolutePathInUserFiles);
};

export default deleteFileFromUserFiles;
