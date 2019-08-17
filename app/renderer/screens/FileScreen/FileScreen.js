import React from 'react';
import PropTypes from 'prop-types';
import { useMachine } from '@xstate/react';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

import { RECEIVE_ENTITIES } from './actionTypes';
import machine from './machine';
import store from '../../redux/store';
import FileMenuContainer from './containers/FileMenuContainer';
import openFileByName from '../../fs/openFileByName';
import AddCategoryWidget from './AddCategoryWidget/AddCategoryWidget';
import FileNameWidget from './FileNameWidget/FileNameWidget';
import CategoriesWidget from './CategoriesWidget/CategoriesWidget';
import { Divider, Icon, Header } from 'semantic-ui-react';
import deleteFileFromFs from '../../fs/deleteFile';
import queryCategoriesOfFile from '../../db/queries/getCategoriesOfFile';
import queryFileName from '../../db/queries/queryFileName';
import queryRemoveFileFromFilesTable from '../../db/queries/queryRemoveFileFromFilesTable';
import WebclipWidget from './WebclipWidget/WebclipWidget';

const fetchFileData = async (fileId) => {
  const fileName = await queryFileName(fileId);
  const categories = await queryCategoriesOfFile(fileId);
  const resolvedValue = {
    categories,
    file: {
      id: fileId,
      name: fileName,
    },
  };
  return Promise.resolve(resolvedValue);
};

const deleteFile = async (file) => {
  await queryRemoveFileFromFilesTable(file.id);
  try {
    await deleteFileFromFs(file.name);
  } catch (error) {
    console.log(`Error: failed to delete file from filesystem: {error}`);
  }
};

const updateCategories = (categories) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      categories: categories,
    },
  });
};

const updateFile = (file) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      file: file,
    },
  });
};

const machineWithConfig = machine.withConfig({
  services: {
    fetchFileData: (context, _) => fetchFileData(context.fileId),
    deleteFile: (_, event) => deleteFile(event.file),
  },
  actions: {
    updateCategories: (_, event) => updateCategories(event.data.categories),
    updateFile: (_, event) => updateFile(event.data.file),
  },
});

const openFile = (file) => {
  openFileByName(file.name);
};

const FileScreen = ({ fileId, file, categories, notifySuccess }) => {
  const [current, send] = useMachine(
    machineWithConfig.withContext({
      fileId: fileId,
    }),
  );
  if (current.matches('idle')) {
    return (
      <div style={{ textAlign: 'center' }}>
        <Icon name="file" color="yellow" size="huge" />
        <FileNameWidget
          notifySuccess={() => notifySuccess()}
          refetchFileData={() => send('REFETCH_FILE_DATA')}
          file={file}
        />
        <Divider horizontal />
        <div style={{ border: '1px solid black', borderRadius: 6, padding: 5 }}>
          <CategoriesWidget
            refetchData={() => send('REFETCH_FILE_DATA')}
            categories={categories}
            file={file}
          />
          <AddCategoryWidget refetchFileData={() => send('REFETCH_FILE_DATA')} />
        </div>
        <Divider horizontal />
        <WebclipWidget fileId={fileId} />
        <FileMenuContainer
          onClickOpenFile={openFile}
          onClickDeleteFile={(file) =>
            send('CLICK_DELETE_FILE', {
              file: file,
            })
          }
        />
        {current.matches('idle.success') ? <h2 style={{ color: 'green' }}>Succeeded</h2> : null}
        {current.matches('idle.failure') ? <h2 style={{ color: 'red' }}>Failed</h2> : null}
      </div>
    );
  } else if (current.matches('loading')) {
    return null;
  } else if (current.matches('deletedFile')) {
    return <h2 style={{ color: 'green' }}>File has been deleted successfully</h2>;
  } else {
    return <h3>Unknown state</h3>;
  }
};

FileScreen.propTypes = {
  fileId: PropTypes.number.isRequired,
  file: PropTypes.object,
  categories: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  notifySuccess: PropTypes.func.isRequired,
};

const getFile = (store) => (store && store.specificTagScreen ? store.specificTagScreen.file : '');

const getCategories = (store) =>
  store && store.specificTagScreen ? store.specificTagScreen.categories : [];

const FileScreenContainer = connect((state) => ({
  file: getFile(state),
  categories: getCategories(state),
}))(FileScreen);

const FileScreenContainerWithToast = (props) => {
  return (
    <>
      <FileScreenContainer
        {...props}
        notifySuccess={() =>
          toast(
            <>
              <Header>
                <Icon name="checkmark" color="green" />
                Renamed successfully
              </Header>
            </>,
          )
        }
      />
      <ToastContainer
        hideProgressBar={true}
        autoClose={3000}
        newestOnTop={true}
        position="top-right"
      />
    </>
  );
};

export default FileScreenContainerWithToast;
