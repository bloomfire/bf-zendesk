import React from 'react';

// components
import LinkIcon from './LinkIcon';
import BrokenLinkIcon from './BrokenLinkIcon';



class Link extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <li>
        {this.props.public && <p className="public">Public</p>}
        <span className="icon-link-container">
          <LinkIcon onClick={this.props.handleClick}/>
          {this.props.includeBrokenLink && <BrokenLinkIcon onClick={this.props.handleClick}/>}
        </span>
        <a href={this.props.href}
           target="_blank">{this.props.title}</a>
      </li>
    );
  }

}



export default Link;
