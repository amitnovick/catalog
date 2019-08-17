import React from 'react';
import PropTypes from 'prop-types';
import { assign } from 'xstate';
import { useMachine } from '@xstate/react';

import SearchCategory from '../../components/SearchCategory';
import machine from './machine';
import querySelectCategoriesWithMatchingName from '../../db/queries/querySelectCategoriesWithMatchingName';

const fetchSearchResultCategories = (inputSearchQuery) => {
  return querySelectCategoriesWithMatchingName(inputSearchQuery);
};

const machineWithConfig = machine.withConfig({
  actions: {
    updateInputSearchQuery: assign({ inputSearchQuery: (_, event) => event.inputSearchQuery }),
    updateSearchResultCategories: assign({ searchResultCategories: (_, event) => event.data }),
  },
  services: {
    fetchSearchResultCategories: (context, _) =>
      fetchSearchResultCategories(context.inputSearchQuery),
  },
});

const SearchCategoryWidget = ({ onFinish }) => {
  const [current, send] = useMachine(
    machineWithConfig.withConfig({
      actions: {
        onFinish: (_, event) => onFinish(event.category),
      },
    }),
  );
  const { inputSearchQuery, searchResultCategories } = current.context;
  return (
    <SearchCategory
      autoFocus={true}
      inputSearchQuery={inputSearchQuery}
      onChangeInputSearchQuery={(inputSearchQuery) =>
        send('CHANGE_INPUT_SEARCH_QUERY', { inputSearchQuery })
      }
      onChooseSearchResultCategory={(category) =>
        send('CHOOSE_SEARCH_RESULT_CATEGORY', { category })
      }
      searchResultCategories={searchResultCategories}
    />
  );
};

SearchCategoryWidget.propTypes = {
  onFinish: PropTypes.func.isRequired,
};

export default SearchCategoryWidget;
