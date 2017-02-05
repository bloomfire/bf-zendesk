import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import {
  fetchOpts,
  getBloomfireUserIDByEmail,
  getFormDataFromJSON,
  capitalizeFirstLetter
}  from '../utils';



class Question extends React.Component {

  constructor(props) {
    super(props);
    // state
    this.state = {
      question: '', // question textarea value
      explanation: '', // explanation input value
      answerers: [{ id: 11972, name: 'Michael Pazienza' }], // answerers input value
      questionIsValid: false, // question textarea value is valid
      linkToTicket: true, // link checkbox
      processing: false, // form is currently being submitted
      submitted: false, // user has attempted to submit the form
      published: false // form was successfully submitted
    };
    // bindings
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateQuestion() {
    const questionIsValid = _.trim(this.state.question).length > 0;
    this.setState({ questionIsValid });
    return questionIsValid;
  }

  validateForm() {
    return this.validateQuestion();
  }

  resetFormValues() {
    this.setState({
      question: '',
      explanation: '',
      answerers: [],
      questionIsValid: false,
      linkToTicket: true
    });
  }

  submitForm(userID) {
    return fetch('https://rooms.bloomfire.ws/api/v2/questions', _.merge({}, fetchOpts, {
      method: 'POST',
      body: getFormDataFromJSON({
        author: userID,
        question: this.state.question,
        explanation: this.state.explanation,
        published: true,
        public: false
      })
    }));
  }

  // POST /api/v2/questions/:id/ask_to_answer { "ask_to_answer_ids": [:membership_id1, :membership_id2] }
  submitAnswerers(questionID) {
    const answererIDs = this.state.answerers.map(answerer => answerer.id);
    return fetch(`https://rooms.bloomfire.ws/api/v2/questions/${questionID}/ask_to_answer`, _.merge({}, fetchOpts, {
      method: 'POST',
      body: getFormDataFromJSON({ ask_to_answer_ids: answererIDs })
    }));
  }

  handleChange(event) {
    const target = event.target, // shortcut
          value = target.type === 'checkbox' ? target.checked : target.value,
          name = target.name;
    this.setState({ [name]: value }, () => {
      if (this.state.submitted) {
        if (name === 'question') {
          this.validateQuestion();
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
        .then(getBloomfireUserIDByEmail) // look up current user's email via Bloomfire API
        .then(this.submitForm.bind(this)) // submit form data
        .then(response => response.json()) // extract JSON from response
        .then(data => { // submit answerers, if needed, or just return response data again immediately
          if (this.state.answerers.length > 0) {
            return this.submitAnswerers(data.id)
              .then(response => response.json())
          } else {
            return data;
          }
        })
        .then(data => {
          if (this.state.linkToTicket) {
            this.props.addLinkedResource({
              id: data.id,
              type: data.contribution_type
            }, this.state.question);
          }
          this.setState({
            processing: false,
            published: true,
            submitted: false
          }, this.hidePublished.bind(this));
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
            'question',
            { selected: this.props.isSelected }
          ),
          classNameQuestion = classNames({ invalid: this.state.submitted && !this.state.questionIsValid }),
          classNameSubmit = classNames({ processing: this.state.processing }),
          questionPlaceholder = this.state.submitted && !this.state.questionIsValid ? 'Question required' : 'Question',
          buttonLabel = this.state.published ? 'Published!' : 'Publish';
    return (
      <form className={classNameForm}
            onSubmit={this.handleSubmit}>
        <textarea name="question"
                  value={this.state.question}
                  placeholder={questionPlaceholder}
                  className={classNameQuestion}
                  onChange={this.handleChange}></textarea>
        <input type="text"
               name="explanation"
               value={this.state.explanation}
               placeholder="Description (optional)"
               onChange={this.handleChange}/>
        <input type="text"
               name="answerers"
               value={this.state.answerers}
               placeholder="Assign an Answerer (optional)"
               className="last-field"
               onChange={this.handleChange}/>
        <p className="link-to-ticket">
          <input type="checkbox"
                 id="link-question"
                 name="linkToTicket"
                 checked={this.state.linkToTicket}
                 onChange={this.handleChange}/>
          <label htmlFor="link-question">Link Question to Ticket</label>
        </p>
        <input type="submit"
               value={buttonLabel}
               disabled={this.state.processing || this.state.published}
               className={classNameSubmit}/>
      </form>
    );
  }

}



export default Question;
