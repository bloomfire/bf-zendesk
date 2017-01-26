import React from 'react';



class Tabs extends React.Component {

  render() {
    return (
      <ul className="tabs">
        <li className="tab tab-add-post" data-id="1" onClick={this.props.handleClick}>Add a Post</li>
        <li className="tab tab-add-question" data-id="2" onClick={this.props.handleClick}>Add a Question</li>
      </ul>
    );
  }

}



export default Tabs;
