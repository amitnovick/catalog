import React from 'react';
import PropTypes from 'prop-types';
import { useService } from '@xstate/react';

import ReactContext from './ReactContext';
import Modal from '../../components/Modal';
import ModalHeader from './ModalHeader';
import { Modal as SemanticModal, Button } from 'semantic-ui-react';
import FsResourcePickerModalContent from './FsResourcePickerModalContent';
import ImportFilesList from './ImportFilesList';
import FsResourcesPicker from '../../components/FsResourcesPicker';

const fsResourceTypes = {
  FILE: 'file',
  DIRECTORY: 'directory',
};

const FsResourcesImportModal = ({ onClose, fsResourceType }) => {
  const service = React.useContext(ReactContext);
  const [current, send] = useService(service);

  const shouldDisableSubmitButton = current.matches('chosen.idle') === false;
  const { filesPaths, filePathsAttemptOutcomes } = current.context;

  let ModalContent;
  if (current.matches('choosing')) {
    ModalContent = () => (
      <FsResourcePickerModalContent
        fsResourceType={fsResourceType}
        FsResourcePicker={() => (
          <FsResourcesPicker
            onChosen={(filesPaths) => send('CHOOSE_FILES', { filesPaths })}
            fsResourceType={fsResourceType}>
            {({ onClick }) => (
              <Button size="massive" onClick={onClick}>
                {fsResourceType === fsResourceTypes.FILE ? 'Choose Files' : null}
                {fsResourceType === fsResourceTypes.DIRECTORY ? 'Choose Directories' : null}
              </Button>
            )}
          </FsResourcesPicker>
        )}
      />
    );
  } else if (current.matches('chosen')) {
    const hasAttemptedCopyingAlready = current.matches('chosen.displayAttemptOutcome');

    ModalContent = () => (
      <SemanticModal.Content>
        <ImportFilesList
          hasAttemptedCopyingAlready={hasAttemptedCopyingAlready}
          filesPaths={filesPaths}
          filePathsAttemptOutcomes={filePathsAttemptOutcomes}
        />
      </SemanticModal.Content>
    );
  } else {
    ModalContent = () => (
      <SemanticModal.Content>
        <h2>Unknown state</h2>
      </SemanticModal.Content>
    );
  }

  return (
    <Modal
      onClose={onClose}
      ModalHeader={<ModalHeader />}
      ModalContent={<ModalContent />}
      ModalActions={
        <SemanticModal.Actions>
          <Button onClick={() => send('CLICK_CANCEL')}>Close</Button>
          <Button onClick={() => send('CLICK_IMPORT_BUTTON')} disabled={shouldDisableSubmitButton}>
            Import
          </Button>
        </SemanticModal.Actions>
      }
    />
  );
};

FsResourcesImportModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  fsResourceType: PropTypes.oneOf([fsResourceTypes.FILE, fsResourceTypes.DIRECTORY]),
};

export default FsResourcesImportModal;
