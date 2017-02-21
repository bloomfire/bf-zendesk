import React from 'react';
import ReactDOM from 'react-dom';
import { getTokens } from './utils';

// components
import App from './components/App';

// styles
import css from './less/index.less';



console.log(1); // DEV ONLY: ensure that latest app code is still loading // TODO: comment this line for production



const client = ZAFClient.init();

getTokens(client)
  .then(function(tokens) {
    ReactDOM.render(<App client={client}/>, document.getElementById('app'));
  });
