import React from 'react';
import PropTypes from 'prop-types';
import { useMachine } from '@xstate/react';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

import machine from './machine';
import FileMenu from './components/FileMenu';
import openFileByName from '../../fs/openFileByName';
import AddCategoryWidget from './AddCategoryWidget/AddCategoryWidget';
import FileNameWidget from './FileNameWidget/FileNameWidget';
import CategoriesWidget from './CategoriesWidget/CategoriesWidget';
import { Divider, Icon, Header } from 'semantic-ui-react';
import deleteFileFromUserFiles from '../../fs/deleteFileFromUserFiles';
import queryCategoriesOfFsResource from '../../db/queries/querySelectCategoriesOfFsResource';
import querySelectFsResource from '../../db/queries/querySelectFsResource';
import queryDeleteFsResource from '../../db/queries/queryDeleteFsResource';
import WebclipWidget from './WebclipWidget/WebclipWidget';
import { assign } from 'xstate';
import FsResourceIcon from '../../components/FsResourceIcon';
import fsResourceTypes from '../../fsResourceTypes';
import deleteDirectoryFromUserFiles from '../../fs/deleteDirectoryFromUserFiles';

const fetchFsResourceData = async (fsResourceId) => {
  const fsResource = await querySelectFsResource(fsResourceId);
  const categories = await queryCategoriesOfFsResource(fsResourceId);
  const resolvedValue = {
    categories,
    fsResource: fsResource,
  };
  return Promise.resolve(resolvedValue);
};

const deleteFsResourceFromFs = async (fsResource) => {
  if (fsResource.type === fsResourceTypes.FILE) {
    return deleteFileFromUserFiles(fsResource.name);
  } else if (fsResource.type === fsResourceTypes.DIRECTORY) {
    return deleteDirectoryFromUserFiles(fsResource.name);
  }
};

const deleteFsResource = async (fsResource) => {
  await queryDeleteFsResource(fsResource.id);
  try {
    await deleteFsResourceFromFs(fsResource);
  } catch (error) {
    console.log(`Error: failed to delete fs resource from filesystem: {error}`);
  }
};

const machineWithConfig = machine.withConfig({
  services: {
    fetchFileData: (context, _) => fetchFsResourceData(context.fileId),
    deleteFile: (_, event) => deleteFsResource(event.fsResource),
  },
  actions: {
    updateCategories: assign({ categories: (_, event) => event.data.categories }),
    updateFile: assign({ fsResource: (_, event) => event.data.fsResource }),
  },
});

const openFile = (fsResource) => {
  openFileByName(fsResource.name);
};

const FileScreen = ({ fileId, notifySuccess }) => {
  const [current, send] = useMachine(
    machineWithConfig.withContext({
      fileId: fileId,
    }),
  );

  const { fsResource, categories } = current.context;

  if (current.matches('idle')) {
    return (
      <div style={{ textAlign: 'center', overflowY: 'auto', height: '100%' }}>
        <div style={{ textAlign: 'unset', float: 'left' }}>
          <FsResourceIcon fsResourceType={fsResource.type} size="5x" />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <FileNameWidget
            notifySuccess={() => notifySuccess()}
            refetchFileData={() => send('REFETCH_FILE_DATA')}
            file={fsResource}
          />
        </div>
        <Divider horizontal />
        <div style={{ border: '1px solid black', borderRadius: 6, padding: 5 }}>
          <CategoriesWidget
            refetchData={() => send('REFETCH_FILE_DATA')}
            categories={categories}
            file={fsResource}
          />
          <AddCategoryWidget
            file={fsResource}
            categories={categories}
            refetchFileData={() => send('REFETCH_FILE_DATA')}
          />
        </div>
        <Divider horizontal />
        <WebclipWidget fileId={fileId} />
        <FileMenu
          file={fsResource}
          onClickOpenFile={openFile}
          onClickDeleteFile={(fsResource) =>
            send('CLICK_DELETE_FILE', {
              fsResource: fsResource,
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
    let deletionMessage = 'Unknown resource has been deleted successfully';
    if (fsResource.type === fsResourceTypes.FILE) {
      deletionMessage = 'File has been deleted successfully';
    } else if (fsResource.type === fsResourceTypes.DIRECTORY) {
      deletionMessage = 'Directory has been deleted successfully';
    }
    return <h2 style={{ color: 'green' }}>{deletionMessage}</h2>;
  } else {
    return <h3>Unknown state</h3>;
  }
};

FileScreen.propTypes = {
  fileId: PropTypes.number.isRequired,
  notifySuccess: PropTypes.func.isRequired,
};

const FileScreenContainerWithToast = (props) => {
  return (
    <>
      <FileScreen
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
