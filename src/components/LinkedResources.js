import React from 'react';
import classNames from 'classnames';

// components
import LinkList from './LinkList';
import LinkIcon from './LinkIcon';
import CaretIcon from './CaretIcon';



class LinkedResources extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: false,
      resources: [
        {
          id: '1',
          contribution_type: 'Question',
          question: 'How do I configure my wifi?',
          public: false
        },
        {
          id: '2',
          contribution_type: 'Question',
          question: 'What is the wifi password?',
          public: false
        },
        {
          id: '3',
          contribution_type: 'Question',
          title: 'Why is the red light on my router blinking constantly?',
          public: true
        },
        {
          id: '4',
          contribution_type: 'Question',
          title: 'How do I turn off my wifi device?',
          public: false
        }
      ]
    };
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
    return (
      <section className={classNameSection}>
        <h2>Linked Resources</h2>
        <CaretIcon handleClick={this.toggleCollapsed}/>
        <div className="section-content">
          <div className="links-box">
            <p className="message">No linked resources.</p>
            <p className="instructions">Click <LinkIcon/> to add.</p>
            <LinkList links={this.state.resources}/>
          </div>
        </div>
      </section>
    );
  }

}



export default LinkedResources;
