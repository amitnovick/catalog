import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

import store from './redux/store';
import RouteController from './RouteController';

const rootElement = document.querySelector(document.currentScript.getAttribute('data-container'));

const persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouteController />
    </PersistGate>
  </Provider>,
  rootElement,
);

if (module.hot) {
  module.hot.accept();
}
