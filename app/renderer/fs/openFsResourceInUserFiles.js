import formatFilePath from './formatFilePath';

import { shell } from 'electron';

const openFsResourceInUserFiles = (fileName) => {
  const filePath = formatFilePath(fileName);
  shell.openItem(filePath);
};

export default openFsResourceInUserFiles;
