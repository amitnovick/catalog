/* eslint no-undef: 0 */

function getRectangleDimensions() {
  return new Promise((resolve, reject) => {
    const overlay = document.createElement('div');
    overlay.style.opacity = '0.6';
    overlay.style.background = 'black';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.zIndex = 99999999;
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.position = 'fixed';

    document.body.appendChild(overlay);

    const instructionsMessageContainer = document.createElement('div');

    const messageCompWidth = 450;
    instructionsMessageContainer.style.position = 'fixed';
    instructionsMessageContainer.style.opacity = '0.95';
    instructionsMessageContainer.style.fontSize = '14px';
    instructionsMessageContainer.style.width = messageCompWidth + 'px';
    instructionsMessageContainer.style.maxWidth = messageCompWidth + 'px';
    instructionsMessageContainer.style.border = '1px solid black';
    instructionsMessageContainer.style.background = 'white';
    instructionsMessageContainer.style.color = 'black';
    instructionsMessageContainer.style.top = '10px';
    instructionsMessageContainer.style.textAlign = 'center';
    instructionsMessageContainer.style.padding = '10px';
    instructionsMessageContainer.style.left =
      Math.round(document.body.clientWidth / 2 - messageCompWidth / 2) + 'px';
    instructionsMessageContainer.style.zIndex = overlay.style.zIndex + 1;

    document.body.appendChild(instructionsMessageContainer);

    const INSTRUCTIONS_MESSAGE = `To capture screenshot: Drag and release the mouse. \r\n To cancel: click Escape key or Right-click with the mouse`;

    instructionsMessageContainer.textContent = INSTRUCTIONS_MESSAGE;

    const selection = document.createElement('div');
    selection.style.opacity = '0.5';
    selection.style.border = '1px solid red';
    selection.style.background = 'white';
    selection.style.border = '2px solid black';
    selection.style.zIndex = overlay.style.zIndex - 1;
    selection.style.top = 0;
    selection.style.left = 0;
    selection.style.position = 'fixed';

    document.body.appendChild(selection);

    let isDragging = false;
    let draggingStartPos = null;
    let rectangleDimensions = {};

    function updateSelection() {
      selection.style.left = rectangleDimensions.x + 'px';
      selection.style.top = rectangleDimensions.y + 'px';
      selection.style.width = rectangleDimensions.width + 'px';
      selection.style.height = rectangleDimensions.height + 'px';
    }

    function updateOverlay() {
      overlay.style.opacity = '0.3';
    }

    function setSelectionSizeFromMouse(event) {
      if (event.clientX < draggingStartPos.x) {
        rectangleDimensions.x = event.clientX;
      }

      if (event.clientY < draggingStartPos.y) {
        rectangleDimensions.y = event.clientY;
      }

      rectangleDimensions.width = Math.abs(event.clientX - draggingStartPos.x);
      rectangleDimensions.height = Math.abs(event.clientY - draggingStartPos.y);
      updateSelection();
    }

    function overlayOnMouseDown(event) {
      rectangleDimensions = { x: event.clientX, y: event.clientY, width: 0, height: 0 };
      draggingStartPos = { x: event.clientX, y: event.clientY };
      isDragging = true;
      updateOverlay();
      updateSelection();
    }

    function overlayOnMouseMove(event) {
      if (!isDragging) return;
      setSelectionSizeFromMouse(event);
    }

    function documentOnKeyDown(event) {
      const { key } = event;
      if (key === 'Escape') {
        cleanup();

        resolve(null);
      }
    }

    function documentOnContextMenu(event) {
      event.preventDefault();

      cleanup();

      resolve(null);
    }

    function removeListeners() {
      overlay.removeEventListener('mousedown', overlayOnMouseDown);
      overlay.removeEventListener('mousemove', overlayOnMouseMove);
      overlay.removeEventListener('mouseup', overlayOnMouseUp);
      document.removeEventListener('keydown', documentOnKeyDown);
      document.removeEventListener('contextmenu', documentOnContextMenu);
    }

    function removeElementsFromDom() {
      document.body.removeChild(overlay);
      document.body.removeChild(selection);
      document.body.removeChild(instructionsMessageContainer);
    }

    function overlayOnMouseUp(event) {
      setSelectionSizeFromMouse(event);

      isDragging = false;

      cleanup();

      if (!rectangleDimensions || !rectangleDimensions.width || !rectangleDimensions.height) {
        return;
      }

      // Need to wait a bit before taking the screenshot to make sure
      // the overlays have been removed and don't appear in the
      // screenshot. 10ms is not enough.
      setTimeout(
        () =>
          resolve(
            rectangleDimensions.width === 0 || rectangleDimensions.height === 0
              ? null
              : rectangleDimensions,
          ),
        100,
      );
    }

    function cleanup() {
      removeListeners();

      removeElementsFromDom();
    }

    overlay.addEventListener('mousedown', overlayOnMouseDown);
    overlay.addEventListener('mousemove', overlayOnMouseMove);
    overlay.addEventListener('mouseup', overlayOnMouseUp);
    document.addEventListener('keydown', documentOnKeyDown);
    document.addEventListener('contextmenu', documentOnContextMenu);
  });
}

const notifyFileWasSavedSuccessfully = (fileName) => {
  const toastHtmlContentWrapper = document.createElement('span');

  const checkmarkSpan = document.createElement('span');

  checkmarkSpan.style.fontSize = '20px';
  checkmarkSpan.style.color = 'lightgreen';
  checkmarkSpan.style.marginRight = '26px';
  checkmarkSpan.style.display = 'inline-flex';
  checkmarkSpan.style.verticalAlign = 'middle';

  checkmarkSpan.textContent = '✓';

  const successTextSpan = document.createElement('span');

  successTextSpan.style.display = 'inline-flex';
  successTextSpan.style.verticalAlign = 'middle';

  const CAP_LENGTH = 40;

  const SUFFIX_LENGTH = '.png'.length;

  const fileNameCappedLength =
    fileName.length > CAP_LENGTH
      ? `${fileName.substring(0, CAP_LENGTH - SUFFIX_LENGTH)} ... ${fileName.substring(
          fileName.length - SUFFIX_LENGTH,
        )}`
      : fileName;

  successTextSpan.textContent = `SAVED: ${fileNameCappedLength}`;

  toastHtmlContentWrapper.appendChild(checkmarkSpan);
  toastHtmlContentWrapper.appendChild(successTextSpan);

  iqwerty.toast.Toast(toastHtmlContentWrapper, {
    settings: {
      duration: 3000,
    },
  });
};

browser.runtime.onMessage.addListener(async (message) => {
  console.info('Message: ' + message.name);

  if (message.name === 'catalog-get-rectangle-dimensions') {
    return getRectangleDimensions();
  } else if (message.name === 'catalog-notify-saved-screenshot-successfully') {
    const { fileName } = message.payload;
    notifyFileWasSavedSuccessfully(fileName);
  } else {
    throw new Error('Unknown command: ' + JSON.stringify(message));
  }
});
