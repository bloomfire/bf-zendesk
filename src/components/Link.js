import React from 'react';

// components
import LinkIcon from './LinkIcon';
import ExternalLinkIcon from './ExternalLinkIcon';
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
          <LinkIcon handleClick={this.props.handleLinkIconClick}/>
          {this.props.includeBrokenLink && <BrokenLinkIcon handleClick={this.props.handleLinkIconClick}/>}
        </span>
        <a href={this.props.href}
           target="_blank">{this.props.title}</a>
        <span className="icon-external-link-container">
          <ExternalLinkIcon handleClick={this.props.handleExternalLinkIconClick}/>
        </span>
      </li>
    );
  }

}



export default Link;
