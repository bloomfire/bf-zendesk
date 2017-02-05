import React from 'react';

// components
import Link from './Link';



class LinkList extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const linkPropSet = this.props.links.map(link => ({
      key: link.id,
      href: `https://rooms.bloomfire.ws/${link.contribution_type}s/${link.id}`,
      title: link.title || link.question,
      public: link.public,
      includeBrokenLink: this.props.includeBrokenLink
    }));
    return (
      <ul className="link-list">
        {linkPropSet.map(linkProps => <Link {...linkProps}/>)}
      </ul>
    );
  }

}



export default LinkList;
