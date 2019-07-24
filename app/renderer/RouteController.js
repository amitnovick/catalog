import React from 'react';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { css } from 'emotion';

import SearchScreen from './screens/SearchScreen/SearchScreen';
import ControlPanelScreen from './screens/ControlPanelScreen/ControlPanelScreen';
import GraphExplorerScreen from './screens/GraphExplorerScreen/GraphExplorerScreenContainer';
import FileScreen from './screens/FileScreen/FileScreen';
import routes from './routes';
import CategoryScreen from './screens/CategoryScreen/CategoryScreen';
import HomeScreen from './screens/HomeScreen';

const linkClass = css({
  fontSize: 20,
  fontFamily: 'helvetica',
  textDecoration: 'none',
  color: 'black',
});

const listItemClass = css({
  margin: 5,
  border: '1px solid black',
  borderRadius: 5,
  padding: '2px 6px',
  ':hover': {
    backgroundColor: '#f0f0f0',
  },
});

const NavigationBox = () => {
  return (
    <ul
      className={css({
        display: 'flex',
        flexDirection: 'row',
        listStyle: 'none',
        padding: 5,
      })}>
      <li className={listItemClass}>
        <Link to={routes.HOME} className={linkClass}>
          Home
        </Link>
      </li>
      <li className={listItemClass}>
        <Link to={routes.CONTROL_PANEL} className={linkClass}>
          Control Panel
        </Link>
      </li>
      <li className={listItemClass}>
        <Link to={routes.SEARCH} className={linkClass}>
          Search
        </Link>
      </li>
      <li className={listItemClass}>
        <Link to={routes.TREE_EXPLORER} className={linkClass}>
          Tree Explorer
        </Link>
      </li>
    </ul>
  );
};

const Layout = ({ BodyComponent, HeaderComponent }) => {
  return (
    <div>
      {HeaderComponent}
      {BodyComponent}
    </div>
  );
};

const RouteController = () => {
  return (
    <Router>
      <Switch>
        <Route
          exact
          path={routes.HOME}
          render={() => (
            <Layout BodyComponent={<HomeScreen />} HeaderComponent={<NavigationBox />} />
          )}
        />
        <Route
          exact
          path={routes.CONTROL_PANEL}
          render={() => (
            <Layout BodyComponent={<ControlPanelScreen />} HeaderComponent={<NavigationBox />} />
          )}
        />
        <Route
          exact
          path={routes.SEARCH}
          render={() => (
            <Layout BodyComponent={<SearchScreen />} HeaderComponent={<NavigationBox />} />
          )}
        />
        <Route
          exact
          path={routes.TREE_EXPLORER}
          render={() => (
            <Layout
              key="root"
              BodyComponent={<GraphExplorerScreen initialCategoryId={undefined} />}
              HeaderComponent={<NavigationBox />}
            />
          )}
        />

        <Route
          exact
          path={`${routes.TREE_EXPLORER}/:id`}
          render={({ match }) => (
            <Layout
              key={match.params.id}
              BodyComponent={<GraphExplorerScreen initialCategoryId={match.params.id} />}
              HeaderComponent={<NavigationBox />}
            />
          )}
        />
        <Route
          exact
          path={`${routes.FILE}/:id`}
          render={({ match }) => (
            <Layout
              BodyComponent={<FileScreen fileId={Number(match.params.id)} />}
              HeaderComponent={<NavigationBox />}
            />
          )}
        />
        <Route
          exact
          path={`${routes.CATEGORY}/:id`}
          render={({ match }) => (
            <Layout
              key={match.params.id}
              BodyComponent={<CategoryScreen categoryId={Number(match.params.id)} />}
              HeaderComponent={<NavigationBox />}
            />
          )}
        />
        <Route render={() => <h2>Unknown route</h2>} />
      </Switch>
    </Router>
  );
};

export default RouteController;
