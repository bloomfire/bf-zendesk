import React from 'react';

// components
import Result from './Result';



class Results extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      message: 'You might find these resources helpful:',
      results: [
        {
          title: 'What time is it in London?',
          href: 'http://www.google.com/',
          public: false
        },
        {
          title: 'Why is the sky blue?',
          href: 'http://www.google.com/',
          public: true
        },
        {
          title: 'What is the wifi password?',
          href: 'http://www.google.com/',
          public: false
        },
        {
          title: 'What do lions do in the woods with...',
          href: 'http://www.google.com/',
          public: false
        }
      ]
    };
  }

  render() {
    return (
      <div className="results">
        <p className="message">{this.state.message}</p>
        <ul className="link-list">
          {this.state.results.map((result, i) => <Result key={i} title={result.title} href={result.href} public={result.public}/>)}
        </ul>
      </div>
    );
  }

}



export default Results;
