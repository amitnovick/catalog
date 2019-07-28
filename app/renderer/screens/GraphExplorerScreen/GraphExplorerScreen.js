import React from 'react';
import PropTypes from 'prop-types';
import { useMachine } from '@xstate/react';
import { Link } from 'react-router-dom';

import { RECEIVE_ENTITIES } from './actionTypes';
import store from '../../redux/store';
import getSqlDriver from '../../sqlDriver';
import machine from './machine';
import { selectParentCategories, selectFiles } from '../../sql_queries';
import queryRootCategory from '../../query-functions/queryRootCategory';
import routes from '../../routes';
import queryChildCategories from '../../query-functions/queryChildCategories';
import queryCategoryNameAndParentId from '../../query-functions/queryCategoryName';
import { Button, List, Grid, Divider } from 'semantic-ui-react';

//////////////////// <STYLING> ///////////////////

const listStyle = {
  listStyle: 'none',
  padding: 0,
};

const threeDotsCss = {
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  display: 'inline-block',
  width: '100%',
};

//////////////////// </STYLING> ///////////////////
const queryParentCategories = (categoryId) => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectParentCategories,
      {
        $category_id: categoryId,
      },
      (err, categoriesRows) => {
        if (err) {
          console.log('err:', err);
          reject();
        } else {
          resolve(categoriesRows);
        }
      },
    );
  });
};

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

const fetchData = async (initialCategoryId) => {
  const representorCategoryId =
    initialCategoryId === undefined
      ? await queryRootCategory().then((rootCategory) => rootCategory.id)
      : initialCategoryId;
  const { name: representorCategoryName } = await queryCategoryNameAndParentId(
    representorCategoryId,
  );
  const files = await queryFiles(representorCategoryId);
  const parentCategories = await queryParentCategories(representorCategoryId);
  const childCategories = await queryChildCategories(representorCategoryId);
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      representorCategory: {
        id: representorCategoryId,
        name: representorCategoryName,
      },
      files: files,
      childCategories: childCategories,
      parentCategories: parentCategories,
    },
  });
};

const machineWithServices = machine.withConfig({
  services: {
    fetchInitialData: (context, _) => fetchData(context.initialCategoryId),
  },
});

const GraphExplorerScreen = ({
  initialCategoryId,
  representorCategory,
  files,
  childCategories,
  parentCategories,
}) => {
  const [current] = useMachine(
    machineWithServices.withContext({
      initialCategoryId: initialCategoryId,
    }),
  );
  const uiState = current.value;
  switch (uiState) {
    case 'loading':
    case 'idle':
      return (
        <>
          <Divider horizontal />
          <Grid>
            <Grid.Column width="3" />
            <Grid.Column width="3" style={{ border: '1px solid black' }}>
              <h2 style={{ textAlign: 'center' }}>Higher:</h2>
              <ul style={listStyle}>
                {parentCategories.map((parentCategory) => (
                  <li key={parentCategory.id} style={threeDotsCss}>
                    <Button
                      color="blue"
                      as={Link}
                      to={`${routes.TREE_EXPLORER}/${parentCategory.id}`}>
                      {parentCategory.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </Grid.Column>
            <Grid.Column width="4" style={{ border: '1px solid black' }}>
              <Button
                color="blue"
                as={Link}
                size="massive"
                to={`${routes.CATEGORY}/${representorCategory.id}`}>
                {representorCategory.name}
              </Button>
              <ul style={listStyle}>
                {files.map((file) => (
                  <li key={file.id} style={{ minWidth: '3em', minHeight: '1.5em' }}>
                    <Button
                      color="yellow"
                      style={{ color: 'black' }}
                      as={Link}
                      size="big"
                      to={`${routes.FILE}/${file.id}`}>
                      {file.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </Grid.Column>
            <Grid.Column width="3" style={{ border: '1px solid black' }}>
              <h2 style={{ textAlign: 'center' }}>Lower:</h2>
              <List style={listStyle}>
                {childCategories.map((childCategory) => (
                  <List.Item key={childCategory.id} style={threeDotsCss}>
                    <Button
                      color="blue"
                      as={Link}
                      to={`${routes.TREE_EXPLORER}/${childCategory.id}`}>
                      {childCategory.name}
                    </Button>
                  </List.Item>
                ))}
              </List>
            </Grid.Column>
            <Grid.Column width="3" />
          </Grid>
          <Divider horizontal />
        </>
      );
    case 'failure':
      return <h2>Failure</h2>;
    default:
      return <h2>Unknown state</h2>;
  }
};

GraphExplorerScreen.propTypes = {
  representorCategory: PropTypes.object.isRequired,
  files: PropTypes.array.isRequired,
  childCategories: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  parentCategories: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

export default GraphExplorerScreen;
