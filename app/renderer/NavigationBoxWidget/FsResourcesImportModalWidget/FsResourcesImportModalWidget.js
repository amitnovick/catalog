import React from 'react';
import { useMachine } from '@xstate/react';
import machine from './machine';
import FilesImportModalWidget from './FilesImportModalWidget/FilesImportModalWidget';
import DirectoriesImportModalWidget from './DirectoriesImportModalWidget/DirectoriesImportModalWidget';
import Modal from '../../components/Modal';
import ModalHeader from './ModalHeader';
import { css } from 'emotion';
import FileIcon from '../../components/FileIcon';
import DirectoryIcon from '../../components/DirectoryIcon';
import { Button, Modal as SemanticModal } from 'semantic-ui-react';

const fsResourceItemClass = css`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  padding: 1em;
  border: 1px solid grey;
  border-radius: 5px;
  align-items: center;
  height: 100%;
`;

const FsResourcesImportModalWidget = ({ onClose }) => {
  const [current, send] = useMachine(machine);

  if (current.matches('choosing')) {
    return (
      <Modal
        onClose={onClose}
        ModalHeader={<ModalHeader />}
        ModalContent={
          <SemanticModal.Content>
            <div
              style={{
                height: '200px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <div
                className={fsResourceItemClass}
                style={{
                  marginRight: '2em',
                }}>
                <div style={{ height: '100%' }}>
                  <DirectoryIcon
                    onClick={() => send('CHOOSE_DIRECTORIES')}
                    style={{
                      width: 150,
                      height: 150,
                    }}
                  />
                </div>
                <div style={{ height: '100%' }}>
                  <span>Directories</span>
                </div>
              </div>

              <div className={fsResourceItemClass}>
                <div style={{ height: '100%' }}>
                  <FileIcon
                    onClick={() => send('CHOOSE_FILES')}
                    style={{
                      width: 150,
                      height: 150,
                    }}
                  />
                </div>
                <div style={{ height: '100%' }}>
                  <span>Files</span>
                </div>
              </div>
            </div>
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

export default FsResourcesImportModalWidget;
