import React from 'react';

// components
import { Link } from './functional';



class Result extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <li>
        <Link/>
        <a href={this.props.href}>{this.props.title}</a>
      </li>
    );
  }

}



export default Result;
