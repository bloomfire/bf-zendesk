import React from 'react';
import classNames from 'classnames';



class Question extends React.Component {

  render() {
    const classNameForm = classNames(
      'question',
      { selected: this.props.isSelected }
    );
    return (
      <form className={classNameForm}>
        <textarea placeholder="Question"></textarea>
        <input type="text" placeholder="Description (optional)"/>
        <input className="last-field" type="text" placeholder="Assign an Answerer"/>
        <p className="link-to-ticket">
          <input type="checkbox" id="link-question"/>
          <label htmlFor="link-question">Link Question to Ticket</label>
        </p>
        <input type="submit" value="Publish"/>
      </form>
    );
  }

}



export default Question;
