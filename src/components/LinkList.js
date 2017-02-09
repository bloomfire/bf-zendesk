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
          const handleClick = this.props.handleClick.bind(this, {
            id: link.id,
            type: link.contribution_type
          });
          return (
            <Link key={link.id}
                  href={`https://mashbox.bloomfire.biz/${link.type}s/${link.id}`}
                  title={link.title}
                  public={link.public}
                  includeBrokenLink={this.props.includeBrokenLink}
                  handleClick={handleClick}/>
          );
        })}
      </ul>
    );
  }

}



export default LinkList;
