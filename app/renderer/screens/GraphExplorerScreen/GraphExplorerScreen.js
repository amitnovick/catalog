import React from 'react';
import PropTypes from 'prop-types';
import { useMachine } from '@xstate/react';
import { Link } from 'react-router-dom';

import { RECEIVE_ENTITIES } from './actionTypes';
import store from '../../redux/store';
import getSqlDriver from '../../sqlDriver';
import machine from './machine';
import { selectFiles } from '../../sql_queries';
import queryRootCategory from '../../query-functions/queryRootCategory';
import routes from '../../routes';
import queryChildCategories from '../../query-functions/queryChildCategories';
import { List, Grid, Divider, Button, Segment } from 'semantic-ui-react';

import queryCategoriesInPath from '../../query-functions/queryCategoriesInPath';
import PathCategoriesMenu from './components/PathCategoriesMenu';
import CategoriesAccordion from './components/CategoriesAccordion';
import FilesAccordion from './components/FilesAccordion';
import CategoryRenameModalWidget from './CategoryRenameModalWidget/CategoryRenameModalWidget';

const queryFiles = (categoryId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectFiles,
      {
        $category_id: categoryId,
      },
      (err, rows) => {
        if (err) {
          console.log('err:', err);
          reject();
        } else {
          resolve(rows);
        }
      },
    );
  });
};

const fetchData = async (currentCategoryId) => {
  const categoriesInPath =
    currentCategoryId === null
      ? await queryRootCategory().then((rootCategory) => [rootCategory])
      : await queryCategoriesInPath(currentCategoryId);

  const representorCategory = categoriesInPath[categoriesInPath.length - 1];

  const files = await queryFiles(representorCategory.id);

  const childCategories = await queryChildCategories(representorCategory.id);

  return Promise.resolve({
    categoriesInPath,
    files,
    childCategories,
  });
};

const updateState = ({ files, childCategories, categoriesInPath }) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      files: files,
      childCategories: childCategories,
      categoriesInPath: categoriesInPath,
    },
  });
};

const updateRenameCategoryInputText = (category) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      categoryRenameModalInputText: category.name,
    },
  });
};

const updateChosenCategoryRenamingCategoryModal = (category) => {
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      chosenCategoryRenamingCategoryModal: category,
    },
  });
};

const machineWithServices = machine.withConfig({
  services: {
    fetchInitialData: (context, _) => fetchData(context.initialCategoryId),
  },
  actions: {
    updateState: (_, event) => updateState(event.data),
    updateRenameCategoryInputText: (_, event) => updateRenameCategoryInputText(event.category),
    updateChosenCategoryRenamingCategoryModal: (_, event) =>
      updateChosenCategoryRenamingCategoryModal(event.category),
  },
});

const GraphExplorerScreen = ({ initialCategoryId, files, childCategories, categoriesInPath }) => {
  const [current, send] = useMachine(
    machineWithServices.withContext({
      initialCategoryId: initialCategoryId,
    }),
  );

  const representorCategory =
    categoriesInPath.length === 0 ? null : categoriesInPath[categoriesInPath.length - 1];

  if (
    current.matches('idle.loading') ||
    current.matches('idle.idle') ||
    current.matches('categoryRenamingModal')
  ) {
    return (
      <>
        <Divider horizontal />
        {current.matches('idle.loading') ? (
          <Button fluid color="blue" size="massive" style={{ color: 'transparent' }}>
            Loading...
          </Button>
        ) : (
          <Button
            fluid
            color="blue"
            as={Link}
            size="massive"
            to={`${routes.CATEGORY}/${representorCategory.id}`}>
            {representorCategory.name}
          </Button>
        )}
        <Divider horizontal />
        <Grid>
          <Grid.Column width="3" />
          <Grid.Column width="10">
            <Segment style={{ minHeight: '90vh' }}>
              {current.matches('idle.idle') ? (
                <>
                  <PathCategoriesMenu categoriesInPath={categoriesInPath} />
                  <Divider horizontal />
                  <List celled>
                    <List.Item>
                      <CategoriesAccordion
                        categories={childCategories}
                        onClickRenameButton={(category) =>
                          send('CLICK_CATEGORY_RENAME_BUTTON', { category })
                        }
                      />
                    </List.Item>
                    <List.Item>
                      <FilesAccordion files={files} />
                    </List.Item>
                  </List>
                </>
              ) : null}
            </Segment>
          </Grid.Column>
          <Grid.Column width="3" />
        </Grid>
        <Divider horizontal />
        <CategoryRenameModalWidget
          isOpen={current.matches('categoryRenamingModal')}
          onClose={() => send('CATEGORY_RENAMING_MODAL_CANCEL')}
          refetchCategoryData={() => send('CATEGORY_RENAMING_MODAL_SUBMIT')}
        />
      </>
    );
  } else if (current.matches('idle.failure')) {
    return <h2>Failure</h2>;
  } else {
    return <h2>Unknown state</h2>;
  }
};

GraphExplorerScreen.propTypes = {
  files: PropTypes.array.isRequired,
  childCategories: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  initialCategoryId: PropTypes.any,
  categoriesInPath: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

export default GraphExplorerScreen;
