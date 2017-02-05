import React from 'react';
import classNames from 'classnames';

// components
import Tabs from './Tabs';
import Post from './Post';
import Question from './Question';
import CaretIcon from './CaretIcon';



class AddContent extends React.Component {

  constructor(props) {
    super(props);
    this.initialTabID = '1';
    this.state = {
      isCollapsed: false,
      selectedTabID: this.initialTabID
    };
    this.toggleCollapsed = this.toggleCollapsed.bind(this);
    this.switchTab = this.switchTab.bind(this);
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

  switchTab(event) {
    this.setState({ selectedTabID: event.currentTarget.dataset.id });
  }

  render() {
    const classNameSection = classNames(
      'add-content',
      'section-collapsible',
      { collapsed: this.state.isCollapsed }
    );
    return (
      <section className={classNameSection}>
        <h2>Add content to Bloomfire</h2>
        <CaretIcon handleClick={this.toggleCollapsed}/>
        <div className="section-content">
          <Tabs handleClick={this.switchTab}
                initialTabID={this.initialTabID}/>
          <Post isSelected={this.state.selectedTabID === '1'}
                client={this.props.client}
                addLinkedResource={this.props.addLinkedResource}/>
          <Question isSelected={this.state.selectedTabID === '2'}
                    client={this.props.client}
                    addLinkedResource={this.props.addLinkedResource}/>
        </div>
      </section>
    );
  }

}



export default AddContent;
