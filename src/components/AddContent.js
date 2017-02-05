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
    this.initialTabId = '1';
    this.state = {
      isCollapsed: false,
      selectedTabId: this.initialTabId
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
    this.setState({ selectedTabId: event.currentTarget.dataset.id });
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
                initialTabId={this.initialTabId}/>
          <Post isSelected={this.state.selectedTabId === '1'}
                client={this.props.client}
                addLinkedResource={this.props.addLinkedResource}/>
          <Question isSelected={this.state.selectedTabId === '2'}
                    client={this.props.client}
                    addLinkedResource={this.props.addLinkedResource}/>
        </div>
      </section>
    );
  }

}



export default AddContent;
