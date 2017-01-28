import React from 'react';

// components
import Link from './Link';



class LinkList extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.links.length === 0) {
      return null;
    }
    const linkPropSet = this.props.links.map(link => ({
      key: link.id,
      href: `https://rooms.bloomfire.ws/${link.contribution_type}s/${link.id}`,
      title: link.title || link.question,
      public: link.public
    }));
    return (
      <ul className="link-list">
        {linkPropSet.map(linkProps => <Link {...linkProps}/>)}
      </ul>
    );
  }

}



export default LinkList;
