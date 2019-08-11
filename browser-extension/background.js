/* eslint no-undef: 0 */

async function takeScreenshot() {
  const dataUri = await browser.tabs.captureVisibleTab(null, { format: 'png' });

  return dataUri;
}

const SERVER_PORT = 37740;

const SERVER_URL = `http://localhost:${SERVER_PORT}`;

const commsConstants = {
  IMAGE_DATA_URI: 'imageDataUri',
  PAGE_URL: 'pageUrl',
  PAGE_TITLE: 'pageTitle',
};

async function sendScreenshot(pageUrl, tabTitle) {
  const dataUri = await takeScreenshot();

  const payload = {
    [commsConstants.IMAGE_DATA_URI]: dataUri,
    [commsConstants.PAGE_URL]: pageUrl,
    [commsConstants.PAGE_TITLE]: tabTitle,
  };

  window.fetch(SERVER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

browser.contextMenus.create({
  id: 'catalog-save-screenshot',
  title: 'Clip screenshot to Catalog',
  contexts: ['page'],
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'catalog-save-screenshot') {
    await sendScreenshot(info.pageUrl, tab.title);
  } else {
    console.log('Unrecognized menuItemId', info.menuItemId);
  }
});
