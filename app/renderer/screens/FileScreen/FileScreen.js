//@ts-check

import React from 'react';
import PropTypes from 'prop-types';
import { useMachine } from '@xstate/react';
import { toast } from 'react-toastify';

import machine from './machine';
import FileMenu from './components/FileMenu';
import openFsResourceInUserFiles from '../../fs/openFsResourceInUserFiles';
import AddCategoryWidget from './AddCategoryWidget/AddCategoryWidget';
import FileNameWidget from './FileNameWidget/FileNameWidget';
import CategoriesWidget from './CategoriesWidget/CategoriesWidget';
import { Divider, Icon, Header, Message } from 'semantic-ui-react';
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
    const errorMessage = `Failed to delete fs resource: ${fsResource.name} from filesystem. Error stack: ${error.message}`;
    notifyError(errorMessage);
  }
};

const machineWithConfig = machine.withConfig({
  services: {
    fetchFsResourceData: (context, _) => fetchFsResourceData(context.fsResourceId),
    deleteFsResource: (_, event) => deleteFsResource(event.fsResource),
  },
  actions: {
    updateCategories: assign({ categories: (_, event) => event.data.categories }),
    updateFsResource: assign({ fsResource: (_, event) => event.data.fsResource }),
    updateErrorMessage: assign({
      errorMessage: (_, event) => event.data.message,
    }),
  },
});

const openFsResource = (fsResource) => {
  openFsResourceInUserFiles(fsResource.name);
};

const notifyRenamedSuccessfully = () =>
  toast(
    <>
      <Header>
        <Icon name="checkmark" color="green" />
        Renamed successfully
      </Header>
    </>,
    {
      autoClose: 3000,
      position: 'top-right',
    },
  );

const notifyError = (errorMessage) =>
  toast(errorMessage, {
    type: 'error',
    closeOnClick: false,
    autoClose: false,
    position: 'bottom-center',
  });

const FileScreen = ({ fsResourceId }) => {
  const [current, send] = useMachine(
    machineWithConfig.withContext({
      ...machineWithConfig.initialState.context,
      fsResourceId: fsResourceId,
    }),
  );

  const { fsResource, categories, errorMessage } = current.context;

  if (current.matches('idle')) {
    if (current.matches('failure')) {
      return <Message error>{errorMessage}</Message>;
    } else {
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
              notifySuccess={() => notifyRenamedSuccessfully()}
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
          <WebclipWidget fileId={fsResourceId} />
          <FileMenu
            file={fsResource}
            onClickOpenFile={openFsResource}
            onClickDeleteFile={(fsResource) =>
              send('CLICK_DELETE_FILE', {
                fsResource: fsResource,
              })
            }
          />
        </div>
      );
    }
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
  fsResourceId: PropTypes.number.isRequired,
};

export default FileScreen;
