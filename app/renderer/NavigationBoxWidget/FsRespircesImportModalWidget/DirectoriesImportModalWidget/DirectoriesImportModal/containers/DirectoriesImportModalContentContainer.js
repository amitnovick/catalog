import React from 'react';
import { useService } from '@xstate/react';

import DirectoriesImportModalContent from '../components/DirectoriesImportModalContent';
import ReactContext from '../../ReactContext';
import ImportFilesList from '../../components/ImportFilesList';
import { Button } from 'semantic-ui-react';
import FsResourcesPicker from '../../../../../components/FsResourcesPicker';

const DirectoriesImportModalContentContainer = () => {
  const service = React.useContext(ReactContext);
  const [current, send] = useService(service);
  const { filesPaths, filePathsAttemptOutcomes } = current.context;

  let DirectoriesImportWidget;
  if (current.matches('choosing')) {
    DirectoriesImportWidget = () => (
      <FsResourcesPicker
        onChosen={(filesPaths) => send('CHOOSE_FILES', { filesPaths })}
        fsResourceType="directory">
        {({ onClick }) => (
          <Button size="massive" onClick={onClick}>
            Choose Directories
          </Button>
        )}
      </FsResourcesPicker>
    );
  } else if (current.matches('chosen')) {
    const hasAttemptedCopyingAlready = current.matches('chosen.displayAttemptOutcome');
    DirectoriesImportWidget = () => (
      <ImportFilesList
        hasAttemptedCopyingAlready={hasAttemptedCopyingAlready}
        filesPaths={filesPaths}
        filePathsAttemptOutcomes={filePathsAttemptOutcomes}
      />
    );
  } else {
    DirectoriesImportWidget = () => <h2>Unknown state</h2>;
  }

  return <DirectoriesImportModalContent DirectoriesImportWidget={DirectoriesImportWidget} />;
};

export default DirectoriesImportModalContentContainer;
