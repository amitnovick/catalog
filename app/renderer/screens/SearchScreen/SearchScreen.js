import React from 'react';
import { useMachine } from '@xstate/react';
import machine from './machine';
import { assign } from 'xstate';
import { Accordion, Checkbox, List, Icon, Header, Button, Message } from 'semantic-ui-react';
import LabelledInput from '../../components/SearchBox';
import SearchCategoryWidget from '../../widgets/SearchCategoryWidget/SearchCategoryWidget';
import FileListItem from '../../components/FileListItem';
import queryFilesByName from '../../db/queries/queryFilesByName';
import queryFilesUnderCategoryByFileName from '../../db/queries/queryFilesUnderCategoryByFileName';
import queryFilesUnderCategory from '../../db/queries/queryFilesUnderCategory';

const fetchSearchResultsBothFilters = (inputFileNameText, chosenAncestorCategory) => {
  return queryFilesUnderCategoryByFileName(inputFileNameText, chosenAncestorCategory);
};

const fetchSearchResultsOnlyByNameFilter = (inputFileNameText) => {
  return queryFilesByName(inputFileNameText);
};

const fetchSearchResultsOnlyByAncestorCategoryFilter = (chosenAncestorCategory) => {
  return queryFilesUnderCategory(chosenAncestorCategory);
};

const machineWithConfig = machine.withConfig({
  services: {
    fetchSearchResultsBothFilters: (context, _) =>
      fetchSearchResultsBothFilters(context.inputFileNameText, context.chosenAncestorCategory),
    fetchSearchResultsOnlyByNameFilter: (context, _) =>
      fetchSearchResultsOnlyByNameFilter(context.inputFileNameText),
    fetchSearchResultsOnlyByAncestorCategoryFilter: (context, _) =>
      fetchSearchResultsOnlyByAncestorCategoryFilter(context.chosenAncestorCategory),
  },
  actions: {
    updateSearchResultFiles: assign({
      searchResultFiles: (_, event) => event.data,
    }),
    updateChosenAncestorCategory: assign({
      chosenAncestorCategory: (_, event) => event.category,
    }),
    updateInputFileNameText: assign({
      inputFileNameText: (_, event) => event.inputFileNameText,
    }),
    updateSelectedFileRow: assign({
      selectedFileRow: (_, event) => event.file,
    }),
    updateHasSearchedAtLeastOnce: assign({
      hasSearchedAtLeastOnce: (_, __) => true,
    }),
  },
});

const SearchScreen = () => {
  const [current, send] = useMachine(machineWithConfig, { devTools: true });

  const {
    searchResultFiles,
    inputFileNameText,
    chosenAncestorCategory,
    selectedFileRow,
    hasSearchedAtLeastOnce,
  } = current.context;

  const isFilteringByNameEnabled = current.matches('filtering.filterByName.enabled');

  const isCategoryAccordionOpen =
    current.matches('filtering.filterByAncestorCategory.choosing') ||
    current.matches('filtering.filterByAncestorCategory.enabled');
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '2em' }}>
        <Checkbox
          style={{ display: 'block', marginBottom: '1em' }}
          label={<label style={{ fontSize: '1.5em' }}>Filter by Name</label>}
          checked={isFilteringByNameEnabled}
          onChange={() => send('TOGGLE_FILTER_BY_NAME')}
        />
        {isFilteringByNameEnabled ? (
          <div style={{ marginLeft: '3em' }}>
            <LabelledInput
              onHitEnterKey={() => send('FETCH_DATA')}
              inputText={inputFileNameText}
              onChangeSearchText={(inputFileNameText) =>
                send('CHANGED_TEXT', { inputFileNameText: inputFileNameText })
              }
            />
          </div>
        ) : null}
      </div>

      <Accordion style={{ marginBottom: '2em' }}>
        <Accordion.Title
          active={isCategoryAccordionOpen}
          index={0}
          style={{ fontSize: '1.5em' }}
          onClick={() => {
            if (isCategoryAccordionOpen) {
              send('CLOSED_CATEGORY_ACCORDION');
            } else {
              send('OPENED_CATEGORY_ACCORDION');
            }
          }}>
          <Icon name="dropdown" />
          Filter by Ancestor Category
        </Accordion.Title>
        <Accordion.Content active={isCategoryAccordionOpen} style={{ marginLeft: '3em' }}>
          {current.matches('filtering.filterByAncestorCategory.choosing') ? (
            <SearchCategoryWidget onFinish={(category) => send('CHOSE_CATEGORY', { category })} />
          ) : null}

          {current.matches('filtering.filterByAncestorCategory.enabled') ? (
            <Button
              size="large"
              color="blue"
              icon
              labelPosition="right"
              onClick={() => send('CHOOSE_ANOTHER_CATEGORY')}>
              {`${chosenAncestorCategory.name}`}
              <Icon name="redo" />
            </Button>
          ) : null}
        </Accordion.Content>
      </Accordion>
      <div style={{ textAlign: 'center' }}>
        <Button
          size="massive"
          color="green"
          icon="search"
          style={{ height: '100%', width: '75%' }}
          onClick={() => send('FETCH_DATA')}
          content="Search"
        />
      </div>
      <Header as="h2">Search Results</Header>
      {hasSearchedAtLeastOnce && searchResultFiles.length > 0 ? (
        <List size="big" style={{ overflowY: 'scroll', height: '100%' }}>
          {searchResultFiles.map((searchResultFile) => (
            <FileListItem
              key={searchResultFile.id}
              file={searchResultFile}
              isSelected={selectedFileRow !== null && searchResultFile.id === selectedFileRow.id}
              onClickRow={() => send('SELECT_FILE_ROW', { file: searchResultFile })}
            />
          ))}
        </List>
      ) : null}
      {hasSearchedAtLeastOnce && searchResultFiles.length === 0 ? (
        <Message info>
          <Message.Header>No Results</Message.Header>
        </Message>
      ) : null}
    </div>
  );
};

export default SearchScreen;
