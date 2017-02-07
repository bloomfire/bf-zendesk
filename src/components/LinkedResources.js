import React from 'react';
import classNames from 'classnames';

// components
import LinkList from './LinkList';
import LinkIcon from './LinkIcon';
import CaretIcon from './CaretIcon';



class LinkedResources extends React.Component {

  constructor(props) {
    super(props);
    // state
    this.state = {
      isCollapsed: false
    };
    // bindings
    this.toggleCollapsed = this.toggleCollapsed.bind(this);
  }

  componentDidMount() {
    this.props.resize();
  }

  componentDidUpdate() {
    this.props.resize();
  }

  toggleCollapsed(event) {
    this.setState(prevState => ({
      isCollapsed: !prevState.isCollapsed
    }));
  }

  render() {
    const classNameSection = classNames(
      'linked-resources',
      'section-collapsible',
      { collapsed: this.state.isCollapsed }
    );
    let boxContents;
    if (this.props.links.length > 0) {
      boxContents = <LinkList links={this.props.links}
                              includeBrokenLink={true}
                              handleClick={this.props.removeLinkedResource}/>;
    } else {
      boxContents = <div className="no-linked-resources">
                      <p className="message">No linked resources.</p>
                      <p className="instructions">Click <LinkIcon/> to add</p>
                    </div>;
    }
    return (
      <section className={classNameSection}>
        <h2>Linked Resources</h2>
        <CaretIcon handleClick={this.toggleCollapsed}/>
        <div className="section-content">
          <div className="content-box">
            {boxContents}
          </div>
        </div>
      </section>
    );
  }

}



export default LinkedResources;
