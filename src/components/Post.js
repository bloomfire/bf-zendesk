import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import {
  paragraphify,
  fetchOpts,
  getBloomfireUserIDByEmail,
  getFormDataFromJSON,
  capitalizeFirstLetter,
  getTokens,
  showNewTicketMessage
}  from '../utils';



class Post extends React.Component {

  constructor(props) {
    super(props);
    // state
    this.state = {
      title: '', // title input value
      description: '', // description input value
      body: '', // post body textarea value
      titleIsValid: false, // title input value is valid
      bodyIsValid: false, // body input value is valid
      linkToTicket: true, // link checkbox
      processing: false, // form is currently being submitted
      submitted: false, // user has attempted to submit the form
      published: false // form was successfully submitted
    };
    // bindings
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateTitle() {
    const titleIsValid = _.trim(this.state.title).length > 0;
    this.setState({ titleIsValid });
    return titleIsValid;
  }

  validateBody() {
    const bodyIsValid = _.trim(this.state.body).length > 0;
    this.setState({ bodyIsValid });
    return bodyIsValid;
  }

  validateForm() {
    return this.validateTitle() && this.validateBody();
  }

  resetFormValues() {
    this.setState({
      title: '',
      description: '',
      body: '',
      titleIsValid: false,
      bodyIsValid: false,
      linkToTicket: true
    });
  }

  submitForm(userID) {
    return Promise.all([
             getTokens(this.props.client),
             this.props.client.metadata()
           ])
             .then(values => {
               const sessionToken = values[0].sessionToken,
                     domain = values[1].settings.bloomfire_domain;
               return fetch(`https://${domain}/api/v2/posts?fields=id,contribution_type&session_token=${sessionToken}`, _.merge({}, fetchOpts, {
                        method: 'POST',
                        body: getFormDataFromJSON({
                          author: userID,
                          title: this.state.title,
                          description: this.state.description,
                          post_body: paragraphify(this.state.body),
                          published: true,
                          public: false
                        })
                      }))
                        .then(this.props.handleAPILock) // handle 403/422 status codes
                        .catch(_.noop); // suppress error (no need to continue)
             });
  }

  handleChange(event) {
    const target = event.target, // shortcut
          value = target.type === 'checkbox' ? target.checked : target.value,
          name = target.name;
    this.setState({ [name]: value }, () => {
      if (this.state.submitted) {
        if (name === 'title') {
          this.validateTitle();
        } else if (name === 'body') {
          this.validateBody();
        }
      }
    });
  }

  hidePublished() {
    setTimeout(() => {
      this.setState({ published: false });
    }, 2000);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    if (this.validateForm()) {
      this.setState({ processing: true });
      this.props.client.get('currentUser.email') // get current user's email via Zendesk client SDK
        .then(data => data['currentUser.email']) // extract the returned property
        .then(getBloomfireUserIDByEmail.bind(this, this.props.client, this.props.handleAPILock)) // look up current user's email via Bloomfire API
        .then(this.submitForm.bind(this)) // submit form data
        .then(response => response.json()) // extract JSON from response
        .then(data => {
          if (this.state.linkToTicket) {
            this.props.createLinkedResource({
              display: true,
              id: data.id,
              public: false,
              title: this.state.title,
              type: data.contribution_type
            });
          }
          this.setState({
            processing: false,
            published: true,
            submitted: false
          }, this.hidePublished.bind(this));
          this.resetFormValues();
          getTokens(this.props.client)
            .then(tokenData => showNewTicketMessage(this.props.client, data.contribution_type, data.id, tokenData.loginToken));
        });
    }
  }

  render() {
    const classNameForm = classNames(
            'post',
            { selected: this.props.isSelected }
          ),
          classNameTitle = classNames({ invalid: this.state.submitted && !this.state.titleIsValid }),
          classNameBody = classNames(
            'last-field',
            { invalid: this.state.submitted && !this.state.bodyIsValid }
          ),
          classNameSubmit = classNames({ processing: this.state.processing }),
          titlePlaceholder = this.state.submitted && !this.state.titleIsValid ? 'Title required' : 'Title',
          bodyPlaceholder = this.state.submitted && !this.state.bodyIsValid ? 'Post body required' : 'Post body',
          buttonLabel = this.state.published ? 'Published!' : 'Publish';
    return (
      <form className={classNameForm}
            onSubmit={this.handleSubmit}>
        <input type="text"
               name="title"
               value={this.state.title}
               placeholder={titlePlaceholder}
               className={classNameTitle}
               onChange={this.handleChange}/>
        <input type="text"
               name="description"
               value={this.state.description}
               placeholder="Description (optional)"
               onChange={this.handleChange}/>
        <textarea name="body"
                  value={this.state.body}
                  placeholder={bodyPlaceholder}
                  className={classNameBody}
                  onChange={this.handleChange}></textarea>
        <p className="link-to-ticket">
          <input type="checkbox"
                 id="link-post"
                 name="linkToTicket"
                 checked={this.state.linkToTicket}
                 onChange={this.handleChange}/>
          <label htmlFor="link-post">Link Post to Ticket</label>
        </p>
        <input type="submit"
               value={buttonLabel}
               disabled={this.state.processing || this.state.published}
               className={classNameSubmit}/>
      </form>
    );
  }

}



export default Post;
