import formatFilePath from './formatFilePath';

const childProcess = require('child_process');

const getOpenProgramName = () => {
  switch (process.platform) {
    case 'darwin':
      return 'open';
    case 'win32':
      return 'start';
    case 'win64':
      return 'start';
    default:
      return 'xdg-open';
  }
};

const openFileByName = (fileName) => {
  const filePath = formatFilePath(fileName);
  const openProgramProcess = childProcess.exec(`${getOpenProgramName()} ${filePath}`);
  openProgramProcess.stderr.on('data', (data) => {
    console.log('Error while trying to open file:', data);
  });
};

export default openFileByName;
