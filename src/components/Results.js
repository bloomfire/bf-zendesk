import React from 'react';

// components
import Result from './Result';



class Results extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      message: 'You might find these resources helpful:'
    };
  }

  render() {
    const resultPropSet = this.props.results.map(result => ({
      key: result.id,
      href: `https://rooms.bloomfire.ws/${result.contribution_type}s/${result.id}`,
      title: result.title || result.question,
      public: result.public,
    }));
    return (
      <div className="results">
        <p className="message">{this.state.message}</p>
        <ul className="link-list">
          {resultPropSet.map(resultProps => <Result {...resultProps}/>)}
        </ul>
      </div>
    );
  }

}



export default Results;
