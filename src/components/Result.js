import React from 'react';

// components
import LinkIcon from './LinkIcon';



class Result extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <li>
        <LinkIcon/>
        <a href={this.props.href}>{this.props.title}</a>
        {this.props.public && <p className="public">Public</p>}
      </li>
    );
  }

}



export default Result;
