import React from 'react';
import classNames from 'classnames';



class Post extends React.Component {

  render() {
    const classNameForm = classNames(
      'post',
      { selected: this.props.isSelected }
    );
    return (
      <form className={classNameForm}>
        <input type="text" name="title" placeholder="Title"/>
        <input type="text" name="description" placeholder="Description (optional)"/>
        <textarea name="body" placeholder="Post body"></textarea>
        <p className="link-to-ticket">
          <input type="checkbox" name="link" id="link-post"/>
          <label htmlFor="link-post">Link Post to Ticket</label>
        </p>
        <input type="submit" name="publish" value="Publish"/>
      </form>
    );
  }

}



export default Post;
