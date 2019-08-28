import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import SearchScreen from './screens/SearchScreen/SearchScreen';
import ExplorerScreen from './screens/ExplorerScreen/ExplorerScreen';
import FileScreen from './screens/FileScreen/FileScreen';
import routes from './routes';
import HomeScreen from './screens/HomeScreen';
import NavigationBoxWidget from './NavigationBoxWidget/NavigationBoxWidget';
import LoadConfigFileScreenContainer from './screens/StartupScreens/LoadConfigFileScreen/LoadConfigFileScreen';
import ResourceAdditionTimelineScreen from './screens/ResourceAdditionTimelineScreen/ResourceAdditionTimelineScreen';
import BodyLayout from './components/BodyLayout';

const Layout = ({ BodyComponent, HeaderComponent }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
      }}>
      <ToastContainer
        enableMultiContainer
        hideProgressBar={true}
        newestOnTop={true}
        draggable={false}
      />
      {HeaderComponent}
      <BodyLayout>{BodyComponent}</BodyLayout>
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
              BodyComponent={<ExplorerScreen initialCategoryId={null} />}
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
              BodyComponent={<ExplorerScreen initialCategoryId={match.params.id} />}
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
              BodyComponent={<FileScreen fsResourceId={Number(match.params.id)} />}
              HeaderComponent={<NavigationBoxWidget />}
            />
          )}
        />
        <Route
          exact
          path={routes.RESOURCES_ADDITION_TIMELINE}
          render={({ match }) => (
            <Layout
              key="first"
              BodyComponent={<ResourceAdditionTimelineScreen pageNumber={1} />}
              HeaderComponent={<NavigationBoxWidget path={match.path} />}
            />
          )}
        />

        <Route
          exact
          path={`${routes.RESOURCES_ADDITION_TIMELINE}/:pageNumber`}
          render={({ match }) => (
            <Layout
              key={match.params.pageNumber}
              BodyComponent={
                <ResourceAdditionTimelineScreen pageNumber={Number(match.params.pageNumber)} />
              }
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
