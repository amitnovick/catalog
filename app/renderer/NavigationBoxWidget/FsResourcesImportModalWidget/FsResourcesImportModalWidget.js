import React from 'react';
import PropTypes from 'prop-types';
import { useMachine } from '@xstate/react';
import machine from './machine';
import FilesImportModalWidget from './correspondingFsResourceWidget/FilesImportModalWidget';
import DirectoriesImportModalWidget from './correspondingFsResourceWidget/DirectoriesImportModalWidget';
import Modal from '../../components/Modal';
import ModalHeader from './components/ModalHeader';
import { Button, Modal as SemanticModal } from 'semantic-ui-react';
import ChooseTypeModalContent from './components/ChooseTypeModalContent';

const FsResourcesImportModalWidget = ({ onClose }) => {
  const [current, send] = useMachine(machine);

  if (current.matches('choosing')) {
    return (
      <Modal
        onClose={onClose}
        ModalHeader={<ModalHeader />}
        ModalContent={
          <SemanticModal.Content>
            <ChooseTypeModalContent
              onChooseFiles={() => send('CHOOSE_FILES')}
              onChooseDirectories={() => send('CHOOSE_DIRECTORIES')}
            />
          </SemanticModal.Content>
        }
        ModalActions={
          <SemanticModal.Actions>
            <Button onClick={() => onClose()}>Close</Button>
          </SemanticModal.Actions>
        }
      />
    );
  } else if (current.matches('files')) {
    return <FilesImportModalWidget onClose={onClose} />;
  } else if (current.matches('directories')) {
    return <DirectoriesImportModalWidget onClose={onClose} />;
  }
};

FsResourcesImportModalWidget.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default FsResourcesImportModalWidget;
