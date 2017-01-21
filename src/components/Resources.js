import React from 'react';



class Resources extends React.Component {

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
      <section className="resources">
        <p className="message">Linked Resources</p>
        <ul>
          {this.state.resources.map((resource, i) => <li key={i}>{resource}</li>)}
        </ul>
      </section>
    );
  }

}



export default Resources;
