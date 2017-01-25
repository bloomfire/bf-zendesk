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
      isCollapsed: false
    };
    this.toggleCollapsed = this.toggleCollapsed.bind(this);
  }

  toggleCollapsed(event) {
    this.setState(prevState => ({
      isCollapsed: !prevState.isCollapsed
    }));
  }

  render() {
    const classNameSection = classNames(
      'add-content',
      { collapsed: this.state.isCollapsed }
    );
    return (
      <section className={classNameSection}>
        <h2>Add content to Bloomfire</h2>
        <CaretIcon handleClick={this.toggleCollapsed}/>
        <div className="section-content">
          <Tabs/>
          <Post/>
          <Question/>
        </div>
      </section>
    );
  }

}



export default AddContent;
