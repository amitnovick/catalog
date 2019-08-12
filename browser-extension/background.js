/* eslint no-undef: 0 */

const SERVER_PORT = 37740;

const SERVER_URL = `http://localhost:${SERVER_PORT}`;

const commsConstants = {
  IMAGE_DATA_URI: 'imageDataUri',
  PAGE_URL: 'pageUrl',
  PAGE_TITLE: 'pageTitle',
};

async function getActiveTab() {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  return tabs[0];
}

async function sendMessageToActiveTab(message) {
  const activeTab = await getActiveTab();

  if (!activeTab) {
    throw new Error('No active tab.');
  }

  try {
    return await browser.tabs.sendMessage(activeTab.id, message);
  } catch (e) {
    console.error(
      'Sending message to active tab failed, you might need to refresh the page after updating the extension.',
      e,
    );
  }
}

function cropImage(newArea, dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = newArea.width;
      canvas.height = newArea.height;

      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        img,
        newArea.x,
        newArea.y,
        newArea.width,
        newArea.height,
        0,
        0,
        newArea.width,
        newArea.height,
      );

      resolve(canvas.toDataURL());
    };

    img.src = dataUrl;
  });
}

async function takeScreenshot(rectangleDimensions) {
  const activeTab = await getActiveTab();

  const zoom = await browser.tabs.getZoom(activeTab.id);

  const finalZoom = zoom * window.devicePixelRatio;

  const newArea = Object.assign({}, rectangleDimensions);
  newArea.x *= finalZoom;
  newArea.y *= finalZoom;
  newArea.width *= finalZoom;
  newArea.height *= finalZoom;

  const dataUrl = await browser.tabs.captureVisibleTab(null, { format: 'png' });

  return await cropImage(newArea, dataUrl);
}

async function sendScreenshot(pageUrl, tabTitle) {
  const rectangleDimensions = await sendMessageToActiveTab({
    name: 'catalog-get-rectangle-dimensions',
  });

  if (rectangleDimensions === null) {
    console.log(`Didn't complete cropping rectangle`);
    return;
  } else {
    const dataUri = await takeScreenshot(rectangleDimensions);

    const payload = {
      [commsConstants.IMAGE_DATA_URI]: dataUri,
      [commsConstants.PAGE_URL]: pageUrl,
      [commsConstants.PAGE_TITLE]: tabTitle,
    };

    await window.fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    await sendMessageToActiveTab({ name: 'catalog-notify-saved-screenshot-successfully' });
  }
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
