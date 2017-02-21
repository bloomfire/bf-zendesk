import React from 'react';

// components
import LockIcon from './LockIcon';



const AccessMessageLocked = (props) => (
  <aside className="access-message access-message-locked">
    <LockIcon/>
    <h3>Access to the Zendesk app<br/>is a premium Bloomfire feature.</h3>
    <p>Please contact <a href="mailto:sales@bloomfire.com" target="_blank">Bloomfire Sales</a> to purchase<br/>this feature for your account.</p>
  </aside>
);



export default AccessMessageLocked;
