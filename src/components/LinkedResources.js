import React from 'react';

// components
import Result from './Result';
import { Caret, Link } from './functional';



class LinkedResources extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      resources: [
        {
          title: 'How do I configure my wifi?',
          href: 'http://www.google.com/',
          public: false
        },
        {
          title: 'What is the wifi password?',
          href: 'http://www.google.com/',
          public: false
        },
        {
          title: 'Why is the red light on my router blinking constantly?',
          href: 'http://www.google.com/',
          public: true
        },
        {
          title: 'How do I turn off my wifi device?',
          href: 'http://www.google.com/',
          public: false
        }
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
            {this.state.resources.map((result, i) => <Result key={i} title={result.title} href={result.href} public={result.public}/>)}
          </ul>
        </div>
      </section>
    );
  }

}



export default LinkedResources;
