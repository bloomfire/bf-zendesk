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
    this.state = {
      isCollapsed: false,
      selectedTabId: '1'
    };
    this.toggleCollapsed = this.toggleCollapsed.bind(this);
    this.switchTab = this.switchTab.bind(this);
  }

  toggleCollapsed(event) {
    this.setState(prevState => ({
      isCollapsed: !prevState.isCollapsed
    }));
  }

  switchTab(event) {
    this.setState({
      selectedTabId: event.currentTarget.dataset.id
    });
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
          <Tabs handleClick={this.switchTab}/>
          <Post isSelected={this.state.selectedTabId === '1'}/>
          <Question isSelected={this.state.selectedTabId === '2'}/>
        </div>
      </section>
    );
  }

}



export default AddContent;
