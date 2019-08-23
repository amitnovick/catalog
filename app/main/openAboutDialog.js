import { dialog } from 'electron';
import path from 'path';

const thisPackage = require('../../package.json');

const description = `Catalog for Desktop`;

const website = `Homepage: https://github.com/amitnovick/catalog`;

const IMAGE_FILE_NAME = '128x128.png';

const openAboutDialog = (window) => {
  const message = [
    description,
    '',
    website,
    '',
    'Copyright © 2019 Amit Novick',
    `${thisPackage.name}, ${thisPackage.version}, ${process.platform}`,
  ].join('\n');

  const iconPath = path.join(process.resourcesPath, IMAGE_FILE_NAME);
  const result = dialog.showMessageBox(window, {
    type: 'info',
    message: message,
    buttons: ['OK'],
    icon: iconPath,
  });
  return result === 0;
};

export default openAboutDialog;
