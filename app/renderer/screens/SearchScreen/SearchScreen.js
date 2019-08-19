import React from 'react';
import { useMachine } from '@xstate/react';
import machine from './machine';
import { assign } from 'xstate';
import { Accordion, Checkbox, List, Icon, Header, Button, Message } from 'semantic-ui-react';
import LabelledInput from '../../components/LabelledInput';
import SearchCategoryWidget from '../../widgets/SearchCategoryWidget/SearchCategoryWidget';
import querySelectFsResourcesByName from '../../db/queries/querySelectFsResourcesByName';
import querySelectFsResourcesInCategorySubtreeWithMatchingFileName from '../../db/queries/querySelectFsResourcesInCategorySubtreeWithMatchingFileName';
import querySelectFsResourcesInCategorySubtree from '../../db/queries/querySelectFsResourcesInCategorySubtree';
import FsResourcesListItemWithNavigation from '../../containers/FsResourceListItemWithNavigation';

const fetchSearchResultsBothFilters = (inputFsResourceNameText, chosenAncestorCategory) => {
  return querySelectFsResourcesInCategorySubtreeWithMatchingFileName(
    inputFsResourceNameText,
    chosenAncestorCategory,
  );
};

const fetchSearchResultsOnlyByNameFilter = (inputFsResourceNameText) => {
  return querySelectFsResourcesByName(inputFsResourceNameText);
};

const fetchSearchResultsOnlyByAncestorCategoryFilter = (chosenAncestorCategory) => {
  return querySelectFsResourcesInCategorySubtree(chosenAncestorCategory);
};

const machineWithConfig = machine.withConfig({
  services: {
    fetchSearchResultsBothFilters: (context, _) =>
      fetchSearchResultsBothFilters(
        context.inputFsResourceNameText,
        context.chosenAncestorCategory,
      ),
    fetchSearchResultsOnlyByNameFilter: (context, _) =>
      fetchSearchResultsOnlyByNameFilter(context.inputFsResourceNameText),
    fetchSearchResultsOnlyByAncestorCategoryFilter: (context, _) =>
      fetchSearchResultsOnlyByAncestorCategoryFilter(context.chosenAncestorCategory),
  },
  actions: {
    updateSearchResultFsResources: assign({
      searchResultFsResources: (_, event) => event.data,
    }),
    updateChosenAncestorCategory: assign({
      chosenAncestorCategory: (_, event) => event.category,
    }),
    updateInputFsResourceNameText: assign({
      inputFsResourceNameText: (_, event) => event.inputFsResourceNameText,
    }),
    updateSelectedFsResourceRow: assign({
      selectedFsResourceRow: (_, event) => event.file,
    }),
    updateHasSearchedAtLeastOnce: assign({
      hasSearchedAtLeastOnce: (_, __) => true,
    }),
  },
});

const SearchScreen = () => {
  const [current, send] = useMachine(machineWithConfig, { devTools: true });

  const {
    searchResultFsResources,
    inputFsResourceNameText,
    chosenAncestorCategory,
    selectedFsResourceRow,
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
              inputText={inputFsResourceNameText}
              onChangeSearchText={(inputFsResourceNameText) =>
                send('CHANGED_TEXT', { inputFsResourceNameText: inputFsResourceNameText })
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
          disabled={
            current.matches('filtering.filterByName.enabled') === false &&
            current.matches('filtering.filterByAncestorCategory.enabled') === false
          }
          size="massive"
          color="green"
          icon="search"
          style={{ height: '100%', width: '75%' }}
          onClick={() => send('FETCH_DATA')}
          content="Search"
        />
      </div>
      <Header as="h2">Search Results</Header>
      {hasSearchedAtLeastOnce && searchResultFsResources.length > 0 ? (
        <List size="big" style={{ overflowY: 'scroll', height: '100%' }}>
          {searchResultFsResources.map((searchResultFile) => (
            <FsResourcesListItemWithNavigation
              key={searchResultFile.id}
              fsResource={searchResultFile}
              isSelected={
                selectedFsResourceRow !== null && searchResultFile.id === selectedFsResourceRow.id
              }
              onClickRow={() => send('SELECT_FILE_ROW', { file: searchResultFile })}
            />
          ))}
        </List>
      ) : null}
      {hasSearchedAtLeastOnce && searchResultFsResources.length === 0 ? (
        <Message info>
          <Message.Header>No Results</Message.Header>
        </Message>
      ) : null}
    </div>
  );
};

export default SearchScreen;
