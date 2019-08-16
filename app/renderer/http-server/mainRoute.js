import formatFilePathRaw from './fs/formatFilePathRaw';
import queryInsertWebclipResource from './db/queryInsertWebclipResource';
import deleteFileRaw from './fs/deleteFileRaw';
import store from '../redux/store';

const isValidFilename = require('valid-filename');
const filenamify = require('filenamify');
const Joi = require('@hapi/joi');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const getFilesSubdirPathIfExists = (store) =>
  store && store.startupScreen && store.startupScreen.userFilesSubdirFilesPath
    ? store.startupScreen.userFilesSubdirFilesPath
    : null;

const writeFile = promisify(fs.writeFile);

const stripEncodingString = (base64EncodedString) =>
  base64EncodedString.replace(/^data:image\/png;base64,/, '');

const writeBase64EncodedFile = (fileName, fileContent) => {
  const filesSubdirPathValue = getFilesSubdirPathIfExists(store.getState());
  if (filesSubdirPathValue === null) {
    return Promise.reject(
      new Error(`File ${fileName} cannot be saved due to instance path not present`),
    );
  } else {
    const filePath = formatFilePathRaw(filesSubdirPathValue, fileName);
    return writeFile(filePath, fileContent, {
      encoding: 'base64',
      flag: 'wx',
    });
  }
};

const formatInitialFileName = (fileName) => `${fileName}.png`;

const formatAlternativeFileName = (fileName, suffix) => `${fileName} ${suffix}.png`;

const writeFileWithNonExistingName = async (originalName, imageFileContent) => {
  try {
    const initialFileName = formatInitialFileName(originalName);
    await writeBase64EncodedFile(initialFileName, imageFileContent);
    return Promise.resolve(initialFileName);
  } catch (error) {
    if (error.code === 'EEXIST') {
      let suffix = 2;
      let foundError = true;
      let alternativeFileName = formatAlternativeFileName(originalName, suffix);
      while (foundError) {
        try {
          await writeBase64EncodedFile(alternativeFileName, imageFileContent);
          foundError = false;
        } catch (error) {
          foundError = true;
          suffix++;
          alternativeFileName = formatAlternativeFileName(originalName, suffix);
        }
      }
      return Promise.resolve(alternativeFileName);
    } else {
      return Promise.reject(new Error(`Unknown error: ${error}`));
    }
  }
};

const sJoi = Joi.defaults((schema) => schema.strict());

const swaggerKeys = {
  DESCRIPTION: 'description',
  NOTES: 'notes',
  TAGS: 'tags',
};

const joiKeys = {
  VALIDATE: 'validate',
};

const commsConstants = {
  IMAGE_DATA_URI: 'imageDataUri',
  PAGE_URL: 'pageUrl',
  PAGE_TITLE: 'pageTitle',
  ERROR: 'error',
  FILE_NAME: 'fileName',
};

const formatValidFileName = (fileName) => {
  if (isValidFilename(fileName)) {
    if (fileName.trim() === '') {
      return 'New Webclip';
    } else {
      return fileName;
    }
  } else {
    const renamedFileName = filenamify(fileName, { replacement: '-' });
    return renamedFileName;
  }
};

const mainRoute = {
  method: 'POST',
  path: '/',
  options: {
    handler: async (request, h) => {
      const {
        [commsConstants.IMAGE_DATA_URI]: imageDataUri,
        [commsConstants.PAGE_URL]: pageUrl,
        [commsConstants.PAGE_TITLE]: pageTitle,
      } = request.payload;

      const imageDataUriStripped = stripEncodingString(imageDataUri);
      const safeFileName = formatValidFileName(pageTitle);

      try {
        const fileName = await writeFileWithNonExistingName(safeFileName, imageDataUriStripped);
        try {
          await queryInsertWebclipResource(fileName, pageUrl, pageTitle);
          console.log('Added web clip:', fileName);
          return h.response({ [commsConstants.FILE_NAME]: fileName }).code(200);
        } catch (error) {
          const filesSubdirPathValue = getFilesSubdirPathIfExists(store.getState());
          const filePath = path.join(filesSubdirPathValue, fileName);
          await deleteFileRaw(
            filePath,
          ); /* Handling case where file doesn't exist on fs but exists in db, doing this would clean up the fail and fail, hopefully leading user to delete the file when they notice the corresponding file doesn't exist in fs */
          throw error;
        }
      } catch (error) {
        console.log('WebClipper: mainRoute: error:', error);
        return h.response({ [commsConstants.ERROR]: error.message }).code(404);
      }
    },
    [swaggerKeys.DESCRIPTION]: 'Add screenshot Webclip',
    [swaggerKeys.NOTES]: 'Add Webclip resource of a screenshot file',
    [swaggerKeys.TAGS]: ['api'],
    payload: {
      maxBytes: 1000 * 1000 * 50, // 50 Mb
      parse: true,
    },
    [joiKeys.VALIDATE]: {
      payload: sJoi.object({
        [commsConstants.IMAGE_DATA_URI]: sJoi
          .string()
          .required()
          .description(`Data URI: for example: image/png;base64,iVBORw0KGgoA... `),
        [commsConstants.PAGE_URL]: sJoi
          .string()
          .required()
          .description('URL of a web page'),
        [commsConstants.PAGE_TITLE]: sJoi
          .string()
          .allow('')
          .required()
          .description('Title of a web page'),
      }),
    },
    response: {
      status: {
        200: sJoi.object({
          [commsConstants.FILE_NAME]: sJoi
            .string()
            .allow('')
            .required(),
        }),
        404: sJoi.object({
          [commsConstants.ERROR]: sJoi.string().required(),
        }),
      },
    },
    cors: {
      origin: ['*'],
      headers: [
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Origin',
        'Accept',
        'Authorization',
        'Content-Type',
        'If-None-Match',
        'Accept-language',
      ],
      additionalHeaders: [
        'Access-Control-Allow-Headers: Origin, Content-Type, x-ms-request-id , Authorization',
      ],
      credentials: true,
    },
  },
};

module.exports = mainRoute;
