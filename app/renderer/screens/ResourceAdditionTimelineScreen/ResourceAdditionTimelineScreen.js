import React from 'react';
import { useMachine } from '@xstate/react';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import machine from './machine';
import { assign } from 'xstate';
import { List, Button, Header } from 'semantic-ui-react';
import querySelectFilesOrderByDateAdded from '../../db/queries/querySelectFilesOrderByDateAdded';
import querySelectCountFiles from '../../db/queries/querySelectCountFiles';
import routes from '../../routes';
import {
  differenceInCalendarDays,
  differenceInCalendarWeeks,
  differenceInCalendarYears,
  differenceInCalendarMonths,
} from 'date-fns';

const ITEMS_PER_PAGE = 20;

const formatDate = (isoDateString) => {
  const currentDate = new Date();
  const yearsDifference = differenceInCalendarYears(currentDate, isoDateString);
  if (yearsDifference >= 1) {
    return `${yearsDifference} years ago`;
  } else {
    const monthsDifference = differenceInCalendarMonths(currentDate, isoDateString);
    if (monthsDifference > 3) {
      return `${monthsDifference} months ago`;
    } else {
      const weeksDifference = differenceInCalendarWeeks(currentDate, isoDateString);
      if (weeksDifference >= 1) {
        return `${weeksDifference} weeks ago`;
      } else {
        const daysDifference = differenceInCalendarDays(currentDate, isoDateString);
        if (daysDifference === 0) {
          return 'Today';
        } else if (daysDifference === 1) {
          return 'Yesterday';
        } else {
          return `${daysDifference} days ago`;
        }
      }
    }
  }
};

const fetchData = async (pageNumber) => {
  const [paginatedResources, countOfFiles] = await Promise.all([
    querySelectFilesOrderByDateAdded(pageNumber, ITEMS_PER_PAGE),
    querySelectCountFiles(),
  ]);
  return Promise.resolve({ paginatedResources, countOfFiles });
};

const machineWithConfig = machine.withConfig({
  services: {
    fetchPaginatedResources: (context, _) => fetchData(context.pageNumber),
  },
  actions: {
    updatePaginatedResources: assign({
      paginatedResources: (_, event) => event.data.paginatedResources,
      countOfFiles: (_, event) => event.data.countOfFiles,
    }),
    updateErrorMessage: assign({
      errorMessage: (_, event) => event.data.message,
    }),
  },
});

const ResourceAdditionTimelineScreen = ({ pageNumber }) => {
  const [current] = useMachine(
    machineWithConfig.withContext({
      ...machine.initialState.context,
      pageNumber: pageNumber,
    }),
    { devTools: true },
  );

  if (current.matches('fetchingPaginatedResources')) {
    return <h2>Loading...</h2>;
  } else if (current.matches('success')) {
    const { paginatedResources, countOfFiles } = current.context;
    const countOfPages = Math.ceil(countOfFiles / ITEMS_PER_PAGE);
    const isThereNextPage = pageNumber < countOfPages;
    const isTherePreviousPage = pageNumber > 1;

    let dateGroupNames = [];
    let dateGroupResources = new Map();
    for (let i = 0; i < paginatedResources.length; i++) {
      const currentPaginatedResource = paginatedResources[i];
      const date = currentPaginatedResource['added_at'];
      const formattedDate = formatDate(date);
      const dateExists = dateGroupNames.some((dateGroup) => dateGroup === formattedDate);

      if (dateExists) {
        const resourcesInDateGroup = dateGroupResources.get(formattedDate);
        dateGroupResources.set(formattedDate, [...resourcesInDateGroup, currentPaginatedResource]);
      } else {
        dateGroupNames.push(formattedDate);
        const newResourcesInDateGroup = [currentPaginatedResource];
        dateGroupResources.set(formattedDate, newResourcesInDateGroup);
      }
    }

    return (
      <>
        <div>
          {Array.from(dateGroupResources.keys()).map((dataGroupNane) => (
            <div key={dataGroupNane}>
              <Header>{dataGroupNane}</Header>
              <List>
                {dateGroupResources.get(dataGroupNane).map((paginatedResource) => (
                  <li key={paginatedResource.id}>{`${paginatedResource.name}`}</li>
                ))}
              </List>
            </div>
          ))}
        </div>
        <h3>{`Page: ${pageNumber}`}</h3>
        {isTherePreviousPage ? (
          <Button
            as={Link}
            to={`${routes.RESOURCES_ADDITION_TIMELINE}/${pageNumber - 1}`}>{`Previous`}</Button>
        ) : null}
        {isThereNextPage ? (
          <Button
            as={Link}
            to={`${routes.RESOURCES_ADDITION_TIMELINE}/${pageNumber + 1}`}>{`Next`}</Button>
        ) : null}
      </>
    );
  } else if (current.matches('failure')) {
    const { errorMessage } = current.context;
    return <h2>{`Error: ${errorMessage}`}</h2>;
  } else {
    return <h2>Unknown state</h2>;
  }
};

ResourceAdditionTimelineScreen.propTypes = {
  pageNumber: PropTypes.number.isRequired,
};

export default ResourceAdditionTimelineScreen;
