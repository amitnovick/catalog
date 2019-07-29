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
import {
  List,
  Grid,
  Divider,
  Accordion,
  Icon,
  Label,
  Message,
  Menu,
  Button,
  Segment,
} from 'semantic-ui-react';
import queryCategoriesInPath from '../../query-functions/queryCategoriesInPath';
import { nil } from 'builder-util-runtime/out/uuid';

//////////////////// <STYLING> ///////////////////

const threeDotsCss = {
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  display: 'inline-block',
  width: '100%',
};

//////////////////// </STYLING> ///////////////////

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

const AccordionWrapper = ({ title, Content, shouldDefaultToActive }) => {
  const panels = [
    {
      key: title,
      title: {
        content: <Label size="big">{title}</Label>,
      },
      content: {
        content: <Content />,
      },
    },
  ];

  return (
    <Accordion
      defaultActiveIndex={shouldDefaultToActive === true ? 0 : undefined}
      panels={panels}
    />
  );
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

const machineWithServices = machine.withConfig({
  services: {
    fetchInitialData: (context, _) => fetchData(context.initialCategoryId),
  },
  actions: {
    updateState: (_, event) => updateState(event.data),
  },
});

const GraphExplorerScreen = ({ initialCategoryId, files, childCategories, categoriesInPath }) => {
  const [current] = useMachine(
    machineWithServices.withContext({
      initialCategoryId: initialCategoryId,
    }),
  );

  const representorCategory =
    categoriesInPath.length === 0 ? null : categoriesInPath[categoriesInPath.length - 1];

  const uiState = current.value;
  switch (uiState) {
    case 'loading':
    case 'idle':
      return (
        <>
          <Divider horizontal />
          {current.matches('loading') ? (
            <Button fluid color="blue" size="massive">
              {'       '}
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
          <Grid style={{ minHeight: '90vh' }}>
            <Grid.Column width="3" />
            <Grid.Column width="10">
              <Segment>
                {current.matches('loading') ? (
                  <h2 style={{ color: 'transparent' }}>Loading...</h2>
                ) : (
                  <>
                    <Menu secondary>
                      {categoriesInPath.map((categoryInPath, categoryIndex) => (
                        <Menu.Item
                          key={categoriesInPath.id}
                          as={Link}
                          to={`${routes.TREE_EXPLORER}/${categoryInPath.id}`}
                          active={categoryIndex === categoriesInPath.length - 1}>
                          {categoryInPath.name}
                        </Menu.Item>
                      ))}
                    </Menu>
                    <Divider horizontal />
                    <List celled>
                      <List.Item>
                        <AccordionWrapper
                          title="Categories"
                          shouldDefaultToActive={true}
                          Content={() => (
                            <List divided selection verticalAlign="middle">
                              {childCategories.length > 0 ? (
                                childCategories.map((childCategory) => (
                                  <List.Item
                                    key={childCategory.id}
                                    as={Link}
                                    to={`${routes.TREE_EXPLORER}/${childCategory.id}`}>
                                    <Icon name="folder" color="blue" size="large" />
                                    <List.Content>
                                      <List.Header style={threeDotsCss}>
                                        {childCategory.name}
                                      </List.Header>
                                    </List.Content>
                                  </List.Item>
                                ))
                              ) : (
                                <List.Item>
                                  <Message info>
                                    <Message.Header>No Categories</Message.Header>
                                  </Message>
                                </List.Item>
                              )}
                            </List>
                          )}
                        />
                      </List.Item>
                      <List.Item>
                        <AccordionWrapper
                          title="Files"
                          shouldDefaultToActive={files.length === 0}
                          Content={() => (
                            <List divided selection verticalAlign="middle">
                              {files.length > 0 ? (
                                files.map((file) => (
                                  <List.Item
                                    key={file.id}
                                    as={Link}
                                    to={`${routes.FILE}/${file.id}`}>
                                    <Icon name="file" color="yellow" size="large" />
                                    <List.Content>
                                      <List.Header style={threeDotsCss}>{file.name}</List.Header>
                                    </List.Content>
                                  </List.Item>
                                ))
                              ) : (
                                <List.Item>
                                  <Message info>
                                    <Message.Header>No Files</Message.Header>
                                  </Message>
                                </List.Item>
                              )}
                            </List>
                          )}
                        />
                      </List.Item>
                    </List>
                  </>
                )}
              </Segment>
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
  files: PropTypes.array.isRequired,
  childCategories: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  initialCategoryId: PropTypes.any,
  categoriesInPath: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};

export default GraphExplorerScreen;
