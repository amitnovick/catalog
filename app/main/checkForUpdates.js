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
import { dialog } from 'electron';

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
  dialog.showMessageBox(
    {
      title: 'No Updates',
      message: 'Current version is up-to-date.',
      buttons: ['Ok'],
    },
    () => {
      menuItem.enabled = true;
      menuItem = null;
    },
  );
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox(
    {
      title: 'Updates Installed',
      message: 'Updates installed',
      buttons: ['Restart app with new version'],
    },
    () => {
      setImmediate(() => {
        autoUpdater.quitAndInstall();
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
