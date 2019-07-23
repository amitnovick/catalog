import React from 'react';
import PropTypes from 'prop-types';
import { useMachine } from '@xstate/react';
import { Link } from 'react-router-dom';
import { css } from 'emotion';

import { RECEIVE_ENTITIES } from './actionTypes';
import store from '../../redux/store';
import getSqlDriver from '../../sqlDriver';
import machine from './machine';
import { selectParentCategories, selectFiles } from '../../sql_queries';
import queryRootCategory from '../../query-functions/queryRootCategory';
import routes from '../../routes';
import queryChildCategories from '../../query-functions/queryChildCategories';
import queryCategoryNameAndParentId from '../../query-functions/queryCategoryName';
import { Button, Icon } from 'semantic-ui-react';

/*  TODO:
  - The idle->loading UI transition should be delayed by 300ms
*/

//////////////////// <GRAPH COMMUNICATION> ///////////////////

const queryParentCategories = categoryId => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectParentCategories,
      {
        $category_id: categoryId
      },
      (err, categoriesRows) => {
        if (err) {
          console.log('err:', err);
          reject();
        } else {
          resolve(categoriesRows);
        }
      }
    );
  });
};

const queryFiles = categoryId => {
  return new Promise((resolve, reject) => {
    getSqlDriver().all(
      selectFiles,
      {
        $category_id: categoryId
      },
      (err, rows) => {
        if (err) {
          console.log('err:', err);
          reject();
        } else {
          resolve(rows);
        }
      }
    );
  });
};

//////////////////// </GRAPH COMMUNICATION> ///////////////////

//////////////////// <STYLING> ///////////////////
const spaceBetweenStyle = {
  display: 'flex',
  justifyContent: 'space-between'
};

const listStyle = {
  listStyle: 'none',
  padding: 0
};

const threeDotsCss = {
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  display: 'inline-block',
  width: '100%'
};

const paneStyle = ({ width }) => ({
  width: width,
  paddingRight: 4,
  paddingLeft: 4,
  border: `1px solid black`
});

const centeredDivStyle = { width: '75%', margin: '0 auto' };

const buttonStyle = {
  width: '100%',
  minWidth: '4em',
  minHeight: '2em',
  backgroundColor: '#fdf6e3', // Solarized base3
  color: '#073642', // Solarized base02
  borderRadius: '2px',
  border: '1px solid #002b36', // Solarized base03
  fontWeight: 700,
  fontSize: '1.5em'
};
//////////////////// </STYLING> ///////////////////

const fetchData = async initialCategoryId => {
  const representorCategoryId =
    initialCategoryId === undefined
      ? await queryRootCategory().then(rootCategory => rootCategory.id)
      : initialCategoryId;
  const { name: representorCategoryName } = await queryCategoryNameAndParentId(
    representorCategoryId
  );
  const files = await queryFiles(representorCategoryId);
  const parentCategories = await queryParentCategories(representorCategoryId);
  const childCategories = await queryChildCategories(representorCategoryId);
  store.dispatch({
    type: RECEIVE_ENTITIES,
    payload: {
      representorCategory: {
        id: representorCategoryId,
        name: representorCategoryName
      },
      files: files,
      childCategories: childCategories,
      parentCategories: parentCategories
    }
  });
};

const machineWithServices = machine.withConfig({
  services: {
    fetchInitialData: (context, _) => fetchData(context.initialCategoryId)
  }
});

const GraphExplorerScreen = ({
  initialCategoryId,
  representorCategory,
  files,
  childCategories,
  parentCategories
}) => {
  const [current] = useMachine(
    machineWithServices.withContext({
      initialCategoryId: initialCategoryId
    })
  );
  const uiState = current.value;
  switch (uiState) {
    case 'loading':
      return <h2>Loading...</h2>;
    case 'idle':
      return (
        <div style={{ ...spaceBetweenStyle, ...centeredDivStyle }}>
          <div style={paneStyle({ width: 250 })}>
            <h2 style={{ textAlign: 'center' }}>Higher:</h2>
            <ul style={listStyle}>
              {parentCategories.map(parentCategory => (
                <li key={parentCategory.id} style={threeDotsCss}>
                  <Link
                    to={`${routes.TREE_EXPLORER}/${parentCategory.id}`}
                    style={buttonStyle}
                  >
                    {parentCategory.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div style={paneStyle({ width: 400 })}>
            <Button
              as={Link}
              size="massive"
              to={`${routes.CATEGORY}/${representorCategory.id}`}
            >
              <Icon name="sign-in alternate" /> {representorCategory.name}
            </Button>
            <ul style={listStyle}>
              {files.map(file => (
                <li
                  key={file.id}
                  style={{ minWidth: '3em', minHeight: '1.5em' }}
                >
                  <Button as={Link} size="big" to={`${routes.FILE}/${file.id}`}>
                    <Icon name="sign-in alternate" /> {file.name}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <div style={paneStyle({ width: 250 })}>
            <h2 style={{ textAlign: 'center' }}>Lower:</h2>
            <ul style={listStyle}>
              {childCategories.map(childCategory => (
                <li key={childCategory.id} style={threeDotsCss}>
                  <Link
                    to={`${routes.TREE_EXPLORER}/${childCategory.id}`}
                    style={buttonStyle}
                  >
                    {childCategory.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
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
  parentCategories: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired
};

export default GraphExplorerScreen;
