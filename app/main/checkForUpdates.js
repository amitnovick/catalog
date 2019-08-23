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

let menuItem;
autoUpdater.autoDownload = false;

autoUpdater.on('error', (error) => {
  dialog.showErrorBox('Error: ', error == null ? 'unknown' : (error.stack || error).toString());
});

autoUpdater.on('update-available', () => {
  dialog.showMessageBox(
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
        menuItem.enabled = true;
        menuItem = null;
      }
    },
  );
});

autoUpdater.on('update-not-available', () => {
  dialog.showMessageBox({
    title: 'No Updates',
    message: 'Current version is up-to-date.',
  });
  menuItem.enabled = true;
  menuItem = null;
});

autoUpdater.on('checking-for-update', () => {
  dialog.showMessageBox({
    title: 'Checking Updates',
    message: 'Checking for update...',
  });
});

autoUpdater.on('download-progress', (progress) => {
  const message = [
    `Download speed: ${progress.bytesPerSecond}`,
    '',
    `Downloaded ${progress.percent}%`,
    '',
    `( ${progress.transferred}/${progress.total} )`,
  ].join('\n');

  dialog.showMessageBox({
    title: 'Downloading Update: Progress',
    message: message,
  });
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox(
    {
      title: 'Install Updates',
      message: 'Updates downloaded, application will be quit for update...',
    },
    () => {
      setImmediate(() => {
        app.removeAllListeners('window-all-closed');
        const focusedWindow = BrowserWindow.getFocusedWindow();
        if (focusedWindow != null) {
          focusedWindow.close();
        }
        autoUpdater.quitAndInstall();
        app.exit();
      });
    },
  );
});

// export this to MenuItem click callback
function checkForUpdates(menuItemRef, focusedWindow, event) {
  menuItem = menuItemRef;
  menuItem.enabled = false;
  autoUpdater.checkForUpdates();
}

module.exports = checkForUpdates;
