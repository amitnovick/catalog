import React from 'react';
import { useMachine } from '@xstate/react';
import machine from './machine';
import { Button, Header } from 'semantic-ui-react';
import FilesImportModalWidget from './FilesImportModalWidget/FilesImportModalWidget';
import DirectoriesImportModalWidget from './DirectoriesImportModalWidget/DirectoriesImportModalWidget';
import Modal from '../../components/Modal';
import FsResourcesImportModalActions from './FsResourcesImportModal/components/FsResourcesImportModalActions';
import FsResourcesImportModalContent from './FsResourcesImportModal/components/FsResourcesImportModalContent';
import FsResourcesImportModalHeader from './FsResourcesImportModal/components/FsResourcesImportModalHeader';

const FsRespircesImportModalWidget = ({ onClose }) => {
  const [current, send] = useMachine(machine);

  if (current.matches('choosing')) {
    return (
      <Modal
        onClose={onClose}
        ModalHeader={<FsResourcesImportModalHeader />}
        ModalContent={
          <FsResourcesImportModalContent
            FileImportWidget={() => (
              <>
                <Button onClick={() => send('CHOOSE_FILES')}>Files</Button>
                <Button onClick={() => send('CHOOSE_DIRECTORIES')}>Directories</Button>
              </>
            )}
          />
        }
        ModalActions={<FsResourcesImportModalActions onClickCancelButton={() => onClose()} />}
      />
    );
  } else if (current.matches('files')) {
    return <FilesImportModalWidget onClose={onClose} />;
  } else if (current.matches('directories')) {
    return <DirectoriesImportModalWidget onClose={onClose} />;
  }
};

export default FsRespircesImportModalWidget;
