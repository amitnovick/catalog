import React from 'react';
import { useMachine } from '@xstate/react';
import { Link } from 'react-router-dom';
import {
  differenceInCalendarDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
} from 'date-fns';
import { css } from 'emotion';
import { List, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { assign } from 'xstate';

import machine from './machine';
import querySelectPaginatedFsResources from '../../db/queries/querySelectPaginatedFsResources';
import querySelectCountFsResources from '../../db/queries/querySelectCountFsResources';
import routes from '../../routes';
import FsResourcesListItemWithNavigation from '../../containers/FsResourceListItemWithNavigation';

const ITEMS_PER_PAGE = 20;

const SEMANTIC_UI_BLUE = '#0E6EB8';

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
  const yearsDifference = differenceInYears(currentDate, inputDateInLocalTime);
  if (yearsDifference >= 1) {
    return `${yearsDifference} years ago`;
  } else {
    const monthsDifference = differenceInMonths(currentDate, inputDateInLocalTime);
    if (monthsDifference > 3) {
      return `${monthsDifference} months ago`;
    } else {
      const weeksDifference = differenceInWeeks(currentDate, inputDateInLocalTime);
      if (weeksDifference >= 1) {
        return `${weeksDifference} weeks ago`;
      } else {
        const daysDifference = differenceInCalendarDays(currentDate, inputDateInLocalTime);
        if (daysDifference === 0) {
          return 'Today';
        } else if (daysDifference === 1) {
          return 'Yesterday';
        } else {
          if (daysDifference === 7) {
            return `${6} days ago`; // Note: if it were 7 full days then we would've handled that case already, but since we reached here, then it must be less than full 7 days but at least 6 calendar days
          } else {
            return `${daysDifference} days ago`;
          }
        }
      }
    }
  }
};

const fetchData = async (pageNumber) => {
  const [paginatedResources, countOfFiles] = await Promise.all([
    querySelectPaginatedFsResources(pageNumber, ITEMS_PER_PAGE),
    querySelectCountFsResources(),
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
    updateSelectedResource: assign({
      selectedResource: (_, event) => event.resource,
    }),
  },
});

const ResourceAdditionTimelineScreen = ({ pageNumber }) => {
  const [current, send] = useMachine(
    machineWithConfig.withContext({
      ...machine.initialState.context,
      pageNumber: pageNumber,
    }),
    { devTools: true },
  );

  if (current.matches('fetchingPaginatedResources')) {
    return null;
  } else if (current.matches('success')) {
    const { paginatedResources, countOfFiles, selectedResource } = current.context;
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
        <List size="big" style={{ height: '100%', overflowY: 'auto' }}>
          {Array.from(dateGroupResources.keys()).map((dataGroupNane) => (
            <List.Item key={dataGroupNane}>
              <div className={flexParentClass}>
                <List.Icon name="calendar alternate outline" />
                <List.Header className={flexExpandingChildClass}>{dataGroupNane}</List.Header>
              </div>
              <List.List>
                {dateGroupResources.get(dataGroupNane).map((paginatedResource) => (
                  <FsResourcesListItemWithNavigation
                    key={paginatedResource.id}
                    fsResource={paginatedResource}
                    isSelected={
                      selectedResource !== null && selectedResource.id === paginatedResource.id
                    }
                    onClickRow={() => send('SELECT_RESOURCE_ROW', { resource: paginatedResource })}
                  />
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
