import React from 'react';
import ReactDOM from 'react-dom';
import { getTokens } from './utils';

// components
import App from './components/App';

// styles
import css from './less/index.less';



// console.log(1); // DEV ONLY: just to ensure that latest app code is still loading // TODO: comment this line out for production



ReactDOM.render(<App client={ZAFClient.init()}/>, document.getElementById('app'));
