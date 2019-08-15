import React from 'react';
import { useMachine } from '@xstate/react';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import machine from './machine';
import { assign } from 'xstate';
import { List, Button } from 'semantic-ui-react';
import querySelectFilesOrderByDateAdded from '../../db/queries/querySelectFilesOrderByDateAdded';
import querySelectCountFiles from '../../db/queries/querySelectCountFiles';
import routes from '../../routes';
import {
  differenceInCalendarDays,
  differenceInCalendarWeeks,
  differenceInCalendarYears,
  differenceInCalendarMonths,
} from 'date-fns';
import { css } from 'emotion';

const ITEMS_PER_PAGE = 20;

const SEMANTIC_UI_BLUE = '#0E6EB8';

const threeDotsClass = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const flexParentClass = css`
  display: flex;
  justify-content: space-between;
`;

const flexExpandingChildClass = css`
  display: inline-block;
  width: 100%;
`;

const hoveredButtonClass = css`
  background-color: white !important;
  color: ${SEMANTIC_UI_BLUE} !important;
  border: 2px solid ${SEMANTIC_UI_BLUE} !important;
  margin: -2px !important;

  :hover {
    background-color: ${SEMANTIC_UI_BLUE} !important;
    color: white !important;
  }
`;

const formatDate = (isoDateString) => {
  const inputDateInLocalTime = new Date(`${isoDateString} UTC`);
  const currentDate = new Date();
  const yearsDifference = differenceInCalendarYears(currentDate, inputDateInLocalTime);
  if (yearsDifference >= 1) {
    return `${yearsDifference} years ago`;
  } else {
    const monthsDifference = differenceInCalendarMonths(currentDate, inputDateInLocalTime);
    if (monthsDifference > 3) {
      return `${monthsDifference} months ago`;
    } else {
      const weeksDifference = differenceInCalendarWeeks(currentDate, inputDateInLocalTime);
      if (weeksDifference >= 1) {
        return `${weeksDifference} weeks ago`;
      } else {
        const daysDifference = differenceInCalendarDays(currentDate, inputDateInLocalTime);
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
    return null;
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
        <List size="big" style={{ height: '100%', overflowY: 'scroll' }}>
          {Array.from(dateGroupResources.keys()).map((dataGroupNane) => (
            <List.Item key={dataGroupNane}>
              <div className={flexParentClass}>
                <List.Icon name="calendar alternate outline" />
                <List.Header className={flexExpandingChildClass}>{dataGroupNane}</List.Header>
              </div>
              <List.List>
                {dateGroupResources.get(dataGroupNane).map((paginatedResource) => (
                  <List.Item key={paginatedResource.id}>
                    <div className={flexParentClass}>
                      <List.Icon name="file" color="yellow" />
                      <List.Header className={`${threeDotsClass} ${flexExpandingChildClass}`}>
                        {`${paginatedResource.name}`}
                      </List.Header>
                    </div>
                  </List.Item>
                ))}
              </List.List>
            </List.Item>
          ))}
        </List>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <Button.Group size="big">
            <Button
              disabled={isTherePreviousPage === false}
              className={hoveredButtonClass}
              as={Link}
              to={`${routes.RESOURCES_ADDITION_TIMELINE}/${pageNumber - 1}`}>{`Newer`}</Button>
            <Button
              disabled={isThereNextPage === false}
              className={hoveredButtonClass}
              as={Link}
              to={`${routes.RESOURCES_ADDITION_TIMELINE}/${pageNumber + 1}`}>{`Older`}</Button>
          </Button.Group>
        </div>
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
