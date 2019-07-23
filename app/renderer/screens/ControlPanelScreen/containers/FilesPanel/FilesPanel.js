import React from 'react';
import { useMachine } from '@xstate/react';

import AddNewFileContainer from '../AddNewFileContainer';
import machine from './machine';
import getSqlDriver from '../../../../sqlDriver';
import { insertFile, deleteFileByName } from '../../../../sql_queries';
import openFileByName from '../../../../utils/openFileByName';
import formatFilePath from '../../../../utils/formatFilePath';
const fs = require('fs');

const writeFileToFs = fileName =>
  new Promise((resolve, reject) => {
    const filePath = formatFilePath(fileName);
    fs.writeFile(filePath, '', { flag: 'wx' }, err => {
      if (err) {
        if (err.code === 'EEXIST') {
          console.log(
            'Error: file already exists on filesystem, did not overwrite'
          );
          reject({ type: 'alreadyExists' });
        } else {
          console.log('unknown error occurred:', err);
          reject({ type: 'unknown' });
        }
      } else {
        console.log('The file has been saved!');
        resolve(fileName);
      }
    });
  });

const fileNameAlreadyExistsErrorMessage =
  'SQLITE_CONSTRAINT: UNIQUE constraint failed: files.name';

const insertFileToDb = async fileName => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      insertFile,
      {
        $file_name: fileName
      },
      function(err) {
        /* Must be non-arrow function, since `this` is used*/
        if (err) {
          if (err.message === fileNameAlreadyExistsErrorMessage) {
            console.log('Error: file already exists in db!');
            reject();
          } else {
            console.log('Error: unknown error isnerting into db');
            reject();
          }
        } else {
          const { changes: affectedRowsCount } = this;
          if (affectedRowsCount !== 1) {
            reject();
          } else {
            resolve();
          }
        }
      }
    );
  });
};

const deleteFileFromDb = async fileName => {
  return new Promise((resolve, reject) => {
    getSqlDriver().run(
      deleteFileByName,
      {
        $file_name: fileName
      },
      function(err) {
        /* Must be non-arrow function, since `this` is used*/
        if (err) {
          console.log('Error: unknown error isnerting into db');
          reject();
        } else {
          const { changes: affectedRowsCount } = this;
          if (affectedRowsCount !== 1) {
            console.log("Error: couldn't delete file when trying to clean-up");
            reject();
          } else {
            console.log('Successfully deleted file from db when cleaning up');
            resolve();
          }
        }
      }
    );
  });
};

const addFile = async fileName => {
  await insertFileToDb(fileName);
  try {
    const filePath = await writeFileToFs(fileName);
    return filePath;
  } catch (error) {
    await deleteFileFromDb(fileName); // clean up after `insertFileToDb`
    throw error;
  }
};

const machineWithConfig = machine.withConfig({
  services: {
    addNewFile: (_, event) => addFile(event.fileName)
  },
  actions: {
    openFile: (_, event) => openFileByName(event.data)
  }
});

const FilesPanel = () => {
  const [current, send] = useMachine(machineWithConfig);
  const addNewFile = fileName =>
    send({ type: 'ADD_NEW_FILE', fileName: fileName });
  if (current.matches('idle')) {
    return (
      <>
        <h1>Add file </h1>
        <AddNewFileContainer onClickAddFile={addNewFile} />
        {current.matches('idle.success') ? (
          <h2 style={{ color: 'green' }}>Succeeded</h2>
        ) : null}
        {current.matches('idle.failure') ? (
          <h2 style={{ color: 'red' }}>Failed</h2>
        ) : null}
      </>
    );
  } else if (current.matches('loading')) {
    return <h2>Loading...</h2>;
  } else {
    return <h2>Unknown state</h2>;
  }
};

export default FilesPanel;
