import React from 'react';

// components
import LinkIcon from './LinkIcon';
import PlusIcon from './PlusIcon';
import BrokenLinkIcon from './BrokenLinkIcon';



class Link extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <li>
        {this.props.public && <p className="public">Public</p>}
        <span className="icon-plus-container">
          <PlusIcon handleClick={this.props.handlePlusIconClick}/>
        </span>
        <span className="icon-link-container">
          <LinkIcon handleClick={this.props.handleLinkIconClick}/>
          {this.props.includeBrokenLink && <BrokenLinkIcon handleClick={this.props.handleLinkIconClick}/>}
        </span>
        <a href={this.props.href}
           target="_blank">{this.props.title}</a>
      </li>
    );
  }

}



export default Link;
