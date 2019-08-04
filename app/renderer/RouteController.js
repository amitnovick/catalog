import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import SearchScreen from './screens/SearchScreen/SearchScreen';
import GraphExplorerScreen from './screens/GraphExplorerScreen/GraphExplorerScreen';
import FileScreen from './screens/FileScreen/FileScreen';
import routes from './routes';
import HomeScreen from './screens/HomeScreen';
import NavigationBoxWidget from './NavigationBoxWidget/NavigationBoxWidget';
import LoadConfigFileScreenContainer from './screens/StartupScreens/LoadConfigFileScreen/LoadConfigFileScreen';

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
        <Route exact path={routes.STARTUP} render={() => <LoadConfigFileScreenContainer />} />
        <Route
          exact
          path={routes.HOME}
          render={({ match }) => (
            <Layout
              BodyComponent={<HomeScreen />}
              HeaderComponent={<NavigationBoxWidget path={match.path} />}
            />
          )}
        />
        <Route
          exact
          path={routes.SEARCH}
          render={({ match }) => (
            <Layout
              BodyComponent={<SearchScreen />}
              HeaderComponent={<NavigationBoxWidget path={match.path} />}
            />
          )}
        />
        <Route
          exact
          path={routes.TREE_EXPLORER}
          render={({ match }) => (
            <Layout
              key="root"
              BodyComponent={<GraphExplorerScreen initialCategoryId={null} />}
              HeaderComponent={<NavigationBoxWidget path={match.path} />}
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
              HeaderComponent={<NavigationBoxWidget />}
            />
          )}
        />
        <Route
          exact
          path={`${routes.FILE}/:id`}
          render={({ match }) => (
            <Layout
              key={match.params.id}
              BodyComponent={<FileScreen fileId={Number(match.params.id)} />}
              HeaderComponent={<NavigationBoxWidget />}
            />
          )}
        />
        <Route render={() => <h2>Unknown route</h2>} />
      </Switch>
    </Router>
  );
};

export default RouteController;
