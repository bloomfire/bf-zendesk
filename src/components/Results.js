import React from 'react';



class Results extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      message: 'You might find these results helpful:',
      results: [
        'What time is it in London?',
        'Why is the sky blue?',
        'What is the wifi password?',
        'What do lions do in the woods with...'
      ]
    };
  }

  render() {
    return (
      <section className="results">
        <p className="message">{this.state.message}</p>
        <ul>
          {this.state.results.map((result, i) => <li key={i}>{result}</li>)}
        </ul>
      </section>
    );
  }

}



export default Results;
