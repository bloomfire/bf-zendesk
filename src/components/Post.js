import React from 'react';



class Post extends React.Component {

  render() {
    return (
      <section className="post">
        <form>
          <input type="text" name="title" placeholder="Title"/>
          <input type="text" name="description" placeholder="Description (optional)"/>
          <textarea name="body" placeholder="Post body"></textarea>
          <p className="link-to-ticket">
            <input type="checkbox" name="link" id="link-post"/>
            <label htmlFor="link-post">Link Post to Ticket</label>
          </p>
          <input type="submit" name="publish" value="Publish"/>
        </form>
      </section>
    );
  }

}



export default Post;
