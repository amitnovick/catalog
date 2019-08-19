import deleteDirectory from './deleteDirectory';
import formatFilePath from './formatFilePath';

const deleteDirectoryFromUserFiles = (directoryPath) => {
  const absolutePathInUserFiles = formatFilePath(directoryPath);
  return deleteDirectory(absolutePathInUserFiles);
};

export default deleteDirectoryFromUserFiles;
