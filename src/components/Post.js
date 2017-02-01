import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import {
  fetchOpts,
  getBloomfireUserIdByEmail,
  getFormDataFromJSON,
  capitalizeFirstLetter
}  from '../utils';



class Post extends React.Component {

  constructor(props) {
    super(props);
    // state
    this.state = {
      titleValue: '', // title input value
      descriptionValue: '', // description input
      bodyValue: '', // post body textarea
      titleIsValid: false, // title input value is valid
      bodyIsValid: false, // body input value is valid
      linkPost: true, // link checkbox
      processing: false, // form is currently being submitted
      submitted: false, // form has ever been submitted
    };
    // bindings
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateForm() {
    const titleIsValid = _.trim(this.state.titleValue).length > 0,
          bodyIsValid = _.trim(this.state.bodyValue).length > 0;
    this.setState({
      titleIsValid,
      bodyIsValid,
    });
    return titleIsValid && bodyIsValid;
  }

  resetFormValues() {
    this.setState({
      title: '',
      description: '',
      body: '',
      linkPost: true
    });
  }

  submitForm(userId) {
    return fetch(`https://rooms.bloomfire.ws/api/v2/posts?session_token=884428610d4b6dccc1591ada914db00923821bab74d2549357c445f0f7c69362`, _.merge({}, fetchOpts, {
      method: 'POST',
      body: getFormDataFromJSON({
        author: userId,
        title: this.state.titleValue,
        description: this.state.descriptionValue,
        post_body: this.state.bodyValue,
        published: true,
        public: false
      })
    }));
  }

  handleChange(event) {
    const target = event.target, // shortcut
          value = target.type === 'checkbox' ? target.checked : target.value,
          name = target.name;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    if (this.validateForm()) {
      this.setState({ processing: true });
      this.props.client.get('currentUser.email') // get current user's email via Zendesk client SDK
        .then(data => data['currentUser.email']) // extract the returned property
        .then(getBloomfireUserIdByEmail) // look up current user's email via Bloomfire API
        .then(this.submitForm.bind(this)) // submit form data
        .then(response => response.json()) // extract JSON from response
        .then(data => {
          this.setState({ processing: false });
          this.resetFormValues();
          const resource = capitalizeFirstLetter(data.contribution_type),
                postURL = `https://rooms.bloomfire.ws/${data.contribution_type}s/${data.id}`,
                message = `You’ve created a new Bloomfire ${resource}. View it here: <a href="${postURL}">${postURL}</a>`;
          this.props.client.invoke('notify', message, 'notice');
        });
    }
  }

  render() {
    const classNameForm = classNames(
            'post',
            { selected: this.props.isSelected }
          ),
          classNameSubmit = classNames({ processing: this.state.processing }),
          classNameTitle = classNames({ invalid: this.state.submitted && !this.state.titleIsValid }),
          classNameBody = classNames(
            'last-field',
            { invalid: this.state.submitted && !this.state.bodyIsValid }
          ),
          titlePlaceholder = this.state.submitted && !this.state.titleIsValid ? 'Title required' : 'Title',
          bodyPlaceholder = this.state.submitted && !this.state.bodyIsValid ? 'Post body required' : 'Post body';
    return (
      <form className={classNameForm}
            onSubmit={this.handleSubmit}>
        <input type="text"
               name="title"
               value={this.state.titleValue}
               placeholder={titlePlaceholder}
               className={classNameTitle}
               onChange={this.handleChange}/>
        <input type="text"
               name="description"
               value={this.state.descriptionValue}
               placeholder="Description (optional)"
               onChange={this.handleChange}/>
        <textarea name="body"
                  value={this.state.bodyValue}
                  placeholder={bodyPlaceholder}
                  className={classNameBody}
                  onChange={this.handleChange}></textarea>
        <p className="link-to-ticket">
          <input type="checkbox"
                 id="link-post"
                 name="linkPost"
                 checked={this.state.linkPost}
                 onChange={this.handleChange}/>
          <label htmlFor="link-post">Link Post to Ticket</label>
        </p>
        <input type="submit"
               value="Publish"
               className={classNameSubmit}/>
      </form>
    );
  }

}



export default Post;
