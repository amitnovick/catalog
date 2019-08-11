import React from 'react';
import { assign } from 'xstate';
import { useMachine } from '@xstate/react';
import { Button, Icon, Divider, Header, List } from 'semantic-ui-react';
import { shell } from 'electron';

import machine from './machine';
import querySelectWebclipData from '../../../db/queries/querySelectWebclipData';
import { css } from 'emotion';
import WebclipIcon from '../../../components/WebclipIcon';

const doesWebclipDataExist = (data) => {
  return data !== null;
};

const openInExternalBrowser = (pageUrl) => {
  shell.openExternal(pageUrl);
};

const machineWithConfig = machine.withConfig({
  services: {
    fetchWebclipData: (context, _) => querySelectWebclipData(context.fileId),
  },
  actions: {
    updateWebclipData: assign({
      pageUrl: (_, event) => event.data.pageUrl,
      pageTitle: (_, event) => event.data.pageTitle,
    }),
    updateErrorMessage: assign({
      errorMessage: (_, event) => event.data.message,
    }),
  },
  guards: {
    doesWebclipDataExist: (_, event) => doesWebclipDataExist(event.data),
  },
});

const threeDotsCssClass = css`
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
`;

const WebclipWidget = ({ fileId }) => {
  const [current] = useMachine(
    machineWithConfig.withContext({
      ...machine.initialState.context,
      fileId: fileId,
    }),
  );

  if (current.matches('fetchingWebclipData')) {
    return <h2>Loading Webclip Data</h2>;
  } else if (current.matches('hasWebclipData')) {
    const { pageUrl, pageTitle } = current.context;
    return (
      <>
        <div style={{ border: '1px solid black', borderRadius: 4, padding: 4 }}>
          <Header as="h2">
            <WebclipIcon style={{ marginRight: '0.5em' }} />
            <Header.Content>Webclip</Header.Content>
          </Header>
          <Button color="teal" size="massive" onClick={() => openInExternalBrowser(pageUrl)}>
            <Icon name="external alternate" />
            Open URL in browser
          </Button>

          <List style={{ textAlign: 'left' }}>
            <li>
              <Header className={threeDotsCssClass}>
                <strong style={{ textDecoration: 'underline' }}>Page title</strong>: {pageTitle}
              </Header>
            </li>
            <li>
              <Header className={threeDotsCssClass}>
                <strong style={{ textDecoration: 'underline' }}>Page URL</strong>: {pageUrl}
              </Header>
            </li>
          </List>
        </div>
        <Divider horizontal />
      </>
    );
  } else if (current.matches('noWebclipData')) {
    return null;
  } else if (current.matches('failure')) {
    return <h2>Failed to lookup Webclip data</h2>;
  }
};

export default WebclipWidget;
