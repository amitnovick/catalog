import formatFilePath from './formatFilePath';

import { shell } from 'electron';

const openFileByName = (fileName) => {
  const filePath = formatFilePath(fileName);
  shell.openItem(filePath);
};

export default openFileByName;
