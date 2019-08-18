import React from 'react';
import { useService } from '@xstate/react';

import FilesImportModalContent from '../components/FilesImportModalContent';
import ReactContext from '../../ReactContext';
import FilesPicker from '../../../../../components/FilesPicker';
import ImportFilesList from '../../components/ImportFilesList';
import { Button } from 'semantic-ui-react';

const FilesImportModalContentContainer = () => {
  const service = React.useContext(ReactContext);
  const [current, send] = useService(service);
  const { filesPaths, filePathsAttemptOutcomes } = current.context;

  let FileImportWidget;
  if (current.matches('choosing')) {
    FileImportWidget = () => (
      <FilesPicker onInput={(filesPaths) => send('CHOOSE_FILES', { filesPaths })}>
        {(filesPickerElementId) => (
          <Button
            as="label"
            htmlFor={filesPickerElementId}
            size="massive" /* Note: It is necessary to have `htmlFor` here and point to the <input/> in order to trigger the Filepicker element */
          >
            Choose Files
          </Button>
        )}
      </FilesPicker>
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

  return <FilesImportModalContent FileImportWidget={FileImportWidget} />;
};

export default FilesImportModalContentContainer;
