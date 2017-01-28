import React from 'react';
import classNames from 'classnames';



class Post extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '', // title input
      description: '', // description input
      body: '', // post body textarea
      linkPost: true, // link checkbox
      processing: false // post is currently being submitted
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target, // shortcut
          value = target.type === 'checkbox' ? target.checked : target.value,
          name = target.name;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ processing: true });
    // this.getSearchResults(this.state.value)
    //   .then(results => {
    //     // console.log(results);
    //     this.setState({
    //       results,
    //       processing: false
    //     });
    //   });
  }

  render() {
    const classNameForm = classNames(
            'post',
            { selected: this.props.isSelected }
          ),
          classNameSubmit = classNames({ processing: this.state.processing });
    return (
      <form className={classNameForm} onSubmit={this.handleSubmit}>
        <input type="text" name="title" value={this.state.title} placeholder="Title" onChange={this.handleChange}/>
        <input type="text" name="description" value={this.state.description} placeholder="Description (optional)" onChange={this.handleChange}/>
        <textarea className="last-field" name="body" value={this.state.body} placeholder="Post body" onChange={this.handleChange}></textarea>
        <p className="link-to-ticket">
          <input type="checkbox" id="link-post" name="linkPost" checked={this.state.linkPost} onChange={this.handleChange}/>
          <label htmlFor="link-post">Link Post to Ticket</label>
        </p>
        <input type="submit" value="Publish" className={classNameSubmit}/>
      </form>
    );
  }

}



export default Post;
