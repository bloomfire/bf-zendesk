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
        {this.props.public && <p className="public">Public</p>}
        <a href={this.props.href} target="_blank"><LinkIcon/>{this.props.title}</a>
      </li>
    );
  }

}



export default Result;
