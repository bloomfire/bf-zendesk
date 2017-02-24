import React from 'react';

// components
import WarningIcon from './WarningIcon';



const AppMessageNoAPI = (props) => (
  <aside className="app-message app-message-no-api">
    <WarningIcon/>
    <h3>The app could not connect<br/>to the Bloomfire API.</h3>
    <p>Please check its configuration settings to be sure<br/>that the Bloomfire Domain and API Key are correct.</p>
  </aside>
);



export default AppMessageNoAPI;
