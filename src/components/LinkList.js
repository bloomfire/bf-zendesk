import React from 'react';

// components
import Link from './Link';



class LinkList extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const links = _.filter(this.props.links, link => link.display); // remove links not meant to be displayed
    return (
      <ul className="link-list">
        {links.map(link => {
          const handleLinkIconClick = this.props.handleLinkIconClick.bind(this, {
                  id: link.id,
                  type: link.contribution_type
                }),
                handlePlusIconClick = this.props.handlePlusIconClick.bind(this, link);
          return (
            <Link key={link.id}
                  href={link.href}
                  title={link.title}
                  public={link.public}
                  includeBrokenLink={this.props.includeBrokenLink}
                  handleLinkIconClick={handleLinkIconClick}
                  handlePlusIconClick={handlePlusIconClick}/>
          );
        })}
      </ul>
    );
  }

}



export default LinkList;
