import React from 'react';

// components
import { Caret, Link } from './functional';



class LinkedResources extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      resources: [
        'How do I configure my wifi?',
        'What is the wifi password?',
        'Why is the red light on my router...',
        'How do I turn off my wifi device?'
      ]
    };
  }

  render() {
    return (
      <section className="linked-resources">
        <h2>Linked Resources</h2>
        <Caret/>
        <div className="links-box">
          <p className="message">No linked resources.</p>
          <p className="instructions">Click <Link/> to add.</p>
          <ul>
            {this.state.resources.map((resource, i) => <li key={i}>{resource}</li>)}
          </ul>
        </div>
      </section>
    );
  }

}



export default LinkedResources;
