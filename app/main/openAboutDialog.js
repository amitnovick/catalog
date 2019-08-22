import { dialog } from 'electron';

const thisPackage = require('../../package.json');

const description = `Catalog for Desktop`;

const website = `Homepage: https://github.com/amitnovick/catalog`;

const openAboutDialog = (window) => {
  const message = [
    description,
    '',
    website,
    '',
    'Copyright © 2019 Amit Novick',
    `${thisPackage.name}, ${thisPackage.version}, ${process.platform}`,
  ].join('\n');

  const result = dialog.showMessageBox(window, {
    type: 'info',
    message: message,
    buttons: ['OK'],
  });
  return result === 0;
};

export default openAboutDialog;
