import React from 'react';

// components
import WarningIcon from './WarningIcon';



const AppMessageAccessUnsupported = (props) => (
  <aside className="app-message app-message-access-unsupported">
    <WarningIcon/>
    <h3>This version of the app<br/>is no longer supported by Bloomfire.</h3>
    <p>Please upgrade to the newest version of the app<br/>in order to continue using it.</p>
  </aside>
);



export default AppMessageAccessUnsupported;
