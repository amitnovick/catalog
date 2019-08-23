/**
 * updater.js
 *
 * Please use manual update only when it is really required, otherwise please use recommended non-intrusive auto update.
 *
 * Import steps:
 * 1. create `updater.js` for the code snippet
 * 2. require `updater.js` for menu implementation, and set `checkForUpdates` callback from `updater` for the click property of `Check Updates...` MenuItem.
 */
/* Imported on 2019-08-23
 * Source: https://github.com/electron-userland/electron-builder/blob/docs/encapsulated%20manual%20update%20via%20menu.js
 */
import { app, dialog, BrowserWindow } from 'electron';

const { autoUpdater } = require('electron-updater');

let updater;
autoUpdater.autoDownload = false;

let win;

function sendStatusToWindow(text) {
  win.webContents.send('message', text);
}

autoUpdater.on('error', (error) => {
  sendStatusToWindow('Error in auto-updater. ' + error);
});

autoUpdater.on('update-available', () => {
  sendStatusToWindow('Update available.');

  dialog.showMessageBox(
    win,
    {
      type: 'info',
      title: 'Found Updates',
      message: 'Found updates, do you want update now?',
      buttons: ['Yes, Update Now', 'No'],
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        autoUpdater.downloadUpdate();
      } else {
        updater.enabled = true;
        updater = null;
      }
    },
  );
});

autoUpdater.on('update-not-available', () => {
  sendStatusToWindow('Current version is up-to-date.');
  updater.enabled = true;
  updater = null;
});

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});

autoUpdater.on('download-progress', (progress) => {
  const message = [
    `Download speed: ${progress.bytesPerSecond}`,
    '',
    `Downloaded ${progress.percent}%`,
    '',
    `( ${progress.transferred}/${progress.total} )`,
  ].join('\n');
  sendStatusToWindow(message);
});

autoUpdater.on('update-downloaded', () => {
  sendStatusToWindow('Update downloaded');
  setImmediate(() => {
    autoUpdater.quitAndInstall();
    app.exit();
  });
});

// export this to MenuItem click callback
function checkForUpdates(menuItem, focusedWindow, event) {
  console.log('menuItem:', menuItem);
  win = new BrowserWindow();
  win.on('closed', () => {
    win = null;
  });

  updater = menuItem;
  updater.enabled = false;
  autoUpdater.checkForUpdates();
}

module.exports = checkForUpdates;
