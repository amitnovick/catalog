import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import SearchScreen from './screens/SearchScreen/SearchScreen';
import ControlPanelScreen from './screens/ControlPanelScreen/ControlPanelScreen';
import GraphExplorerScreen from './screens/GraphExplorerScreen/GraphExplorerScreenContainer';
import FileScreen from './screens/FileScreen/FileScreen';
import routes from './routes';
import CategoryScreen from './screens/CategoryScreen/CategoryScreen';
import HomeScreen from './screens/HomeScreen';
import NavigationBox from './NavigationBox';
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
              HeaderComponent={<NavigationBox path={match.path} />}
            />
          )}
        />
        <Route
          exact
          path={routes.CONTROL_PANEL}
          render={({ match }) => (
            <Layout
              BodyComponent={<ControlPanelScreen />}
              HeaderComponent={<NavigationBox path={match.path} />}
            />
          )}
        />
        <Route
          exact
          path={routes.SEARCH}
          render={({ match }) => (
            <Layout
              BodyComponent={<SearchScreen />}
              HeaderComponent={<NavigationBox path={match.path} />}
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
              HeaderComponent={<NavigationBox path={match.path} />}
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
