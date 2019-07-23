import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './redux/store';
import LoadConfigFileScreen from './StartupScreen/LoadConfigFileScreen/LoadConfigFileScreen';

const rootElement = document.querySelector(document.currentScript.getAttribute('data-container'));

ReactDOM.render(
  <Provider store={store}>
    <LoadConfigFileScreen />
  </Provider>,
  rootElement,
);

if (module.hot) {
  module.hot.accept();
}
