import React from 'react';
import classNames from 'classnames';

// components
import Result from './Result';
import CaretIcon from './CaretIcon';
import LinkIcon from './LinkIcon';



class LinkedResources extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: false,
      resources: [
        {
          title: 'How do I configure my wifi?',
          href: 'http://www.google.com/',
          public: false
        },
        {
          title: 'What is the wifi password?',
          href: 'http://www.google.com/',
          public: false
        },
        {
          title: 'Why is the red light on my router blinking constantly?',
          href: 'http://www.google.com/',
          public: true
        },
        {
          title: 'How do I turn off my wifi device?',
          href: 'http://www.google.com/',
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
            <ul className="link-list">
              {this.state.resources.map((result, i) => <Result key={i} title={result.title} href={result.href} public={result.public}/>)}
            </ul>
          </div>
        </div>
      </section>
    );
  }

}



export default LinkedResources;
