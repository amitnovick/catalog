import React from 'react';
import PropTypes from 'prop-types';
import { useMachine } from '@xstate/react';

import { RECEIVE_ENTITIES } from './actionTypes';
import machine from './machine';
import store from '../../redux/store';
import OpenInExplorerButtonContainer from './containers/OpenInExplorerButtonContainer';
import queryCategoryNameAndParentId from '../../query-functions/queryCategoryName';
import CategoryNameWidget from './CategoryNameWidget/CategoryNameWidget';
import { Divider, Grid, Header } from 'semantic-ui-react';
import DeleteCategoryModal from './DeleteCategoryModal/DeleteCategoryModal';
import DeleteCategoryButtonContainer from './containers/DeleteCategoryButtonContainer';

const fetchCategoryData = async (categoryId) => {
  const { name: categoryName, parent_id: parentCategoryId } = await queryCategoryNameAndParentId(
    categoryId,
  );
  const category = {
    id: categoryId,
    name: categoryName,
  };
  const isRootCategory = parentCategoryId === null;
  return Promise.resolve({ category, isRootCategory: isRootCategory });
};

const updateCategoryData = (category, isRootCategory) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      category: category,
      isRootCategory: isRootCategory,
    },
  });
};

const updateNewCategoryName = (category) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      newCategoryName: category.name,
    },
  });
};

const machineWithConfig = machine.withConfig({
  services: {
    fetchCategoryData: (context, __) => fetchCategoryData(context.categoryId),
  },
  actions: {
    updateCategoryData: (_, event) =>
      updateCategoryData(event.data.category, event.data.isRootCategory),
    updateNewCategoryName: (_, event) => updateNewCategoryName(event.data.category),
  },
});

const CategoryScreen = ({ categoryId }) => {
  const [current, send] = useMachine(
    machineWithConfig.withContext({
      categoryId: categoryId,
    }),
  );
  if (current.matches('idle') || current.matches('fetchingCategoryData')) {
    return (
      <Grid>
        <Grid.Column width="3" />
        <Grid.Column width="10">
          <Header as="h1">Category Screen</Header>
          <CategoryNameWidget refetchCategoryData={() => send('REFETCH_CATEGORY_DATA')} />
          <Divider horizontal />
          <OpenInExplorerButtonContainer />
          <DeleteCategoryModal
            isOpen={current.matches('idle.deleteCategoryStepsModal')}
            onClose={() => send('CLICK_CLOSE_MODAL')}
            onConfirmDelete={() => send('DELETE_CATEGORY_MODAL_CONFIRM_DELETE')}
          />
          <DeleteCategoryButtonContainer
            onClickDeleteCategory={(category) =>
              send('CLICK_DELETE_CATEGORY', {
                category: category,
              })
            }
          />
          {current.matches('idle.failure') ? <h2 style={{ color: 'red' }}>Failed</h2> : null}
        </Grid.Column>
        <Grid.Column width="3" />
      </Grid>
    );
  } else if (current.matches('fetchingFailed')) {
    return <h2 style={{ color: 'red' }}>Error: failed to fetch category data</h2>;
  } else if (current.matches('deletedCategory')) {
    return <h2 style={{ color: 'green' }}>Deleted category successfully</h2>;
  } else {
    return <h2>Unknown error</h2>;
  }
};

CategoryScreen.propTypes = {
  categoryId: PropTypes.number.isRequired,
};

export default CategoryScreen;
