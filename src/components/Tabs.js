import React from 'react';
import classNames from 'classnames';



class Tabs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTabID: this.props.initialTabID
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.props.handleClick(event); // run callback passed in via prop
    this.setState({
      selectedTabID: event.currentTarget.dataset.id
    });
  }

  render() {
    const classNamePostTab = classNames(
            'tab',
            'tab-add-post',
            { selected: this.state.selectedTabID === '1' }
          ),
          classNameQuestionTab = classNames(
            'tab',
            'tab-add-question',
            { selected: this.state.selectedTabID === '2' }
          );
    return (
      <ul className="tabs">
        <li className={classNamePostTab}
            data-id="1"
            onClick={this.handleClick}><span>Add a Post</span></li>
        <li className={classNameQuestionTab}
            data-id="2"
            onClick={this.handleClick}><span>Add a Question</span></li>
      </ul>
    );
  }

}



export default Tabs;
