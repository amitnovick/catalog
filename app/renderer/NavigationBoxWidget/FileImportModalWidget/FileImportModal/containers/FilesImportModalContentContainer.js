import React from 'react';
import { useService } from '@xstate/react';

import FileImportModalContent from '../components/FileImportModalContent';
import ReactContext from '../../ReactContext';
import FilesPicker from '../../components/FilesPicker';
import ImportFilesList from '../../components/ImportFilesList';

const FilesImportModalContentContainer = () => {
  const service = React.useContext(ReactContext);
  const [current, send] = useService(service);
  const { filesPaths, filePathsAttemptOutcomes } = current.context;

  let FileImportWidget;
  if (current.matches('choosing')) {
    FileImportWidget = () => (
      <FilesPicker onInput={(filesPaths) => send('CHOOSE_FILES', { filesPaths })} />
    );
  } else if (current.matches('chosen')) {
    const hasAttemptedCopyingAlready = current.matches('chosen.displayAttemptOutcome');
    FileImportWidget = () => (
      <ImportFilesList
        hasAttemptedCopyingAlready={hasAttemptedCopyingAlready}
        filesPaths={filesPaths}
        filePathsAttemptOutcomes={filePathsAttemptOutcomes}
      />
    );
  } else {
    FileImportWidget = () => <h2>Unknown state</h2>;
  }

  return <FileImportModalContent FileImportWidget={FileImportWidget} />;
};

export default FilesImportModalContentContainer;
