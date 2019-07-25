import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './redux/store';
import RouteController from './RouteController';

const rootElement = document.querySelector(document.currentScript.getAttribute('data-container'));

ReactDOM.render(
  <Provider store={store}>
    <RouteController />
  </Provider>,
  rootElement,
);

if (module.hot) {
  module.hot.accept();
}
