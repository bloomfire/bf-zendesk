import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import {
  fetchOpts,
  getFormDataFromJSON,
  capitalizeFirstLetter,
  getTokens,
  showNewTicketMessage
} from '../utils';

// components
import AskToAnswer from './AskToAnswer';



class Question extends React.Component {

  constructor(props) {
    super(props);
    // state
    this.state = {
      question: '', // question textarea value
      explanation: '', // explanation input value
      answerers: [], // answerers input value
      questionIsValid: false, // question textarea value is valid
      linkToTicket: true, // link checkbox
      processing: false, // form is currently being submitted
      submitted: false, // user has attempted to submit the form
      published: false // form was successfully submitted
    };
    // bindings
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setAnswerers = this.setAnswerers.bind(this);
    this.setCurrentUserID = this.setCurrentUserID.bind(this);
  }

  setAnswerers(answerers) {
    this.setState({ answerers });
  }

  setCurrentUserID(currentUserID) {
    this.currentUserID = currentUserID;
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

  submitForm(currentUserID) {
    return Promise.all([
             getTokens(this.props.client),
             this.props.client.metadata()
           ])
             .then(values => {
               const sessionToken = values[0].sessionToken,
                     domain = values[1].settings.bloomfire_domain;
               return fetch(`https://${domain}/api/v2/questions?fields=id,contribution_type&session_token=${sessionToken}`, _.merge({}, fetchOpts, {
                        method: 'POST',
                        body: getFormDataFromJSON({
                          author: currentUserID,
                          question: this.state.question,
                          explanation: this.state.explanation,
                          published: true,
                          public: false
                        })
                      }))
                        .then(this.props.handleAPILock) // handle 403/422 status codes
                        .catch(_.noop); // suppress error (no need to continue)
             });
  }

  submitAnswerers(questionID) {
    const answererIDs = this.state.answerers.map(answerer => answerer.id);
    return Promise.all([
             getTokens(this.props.client),
             this.props.client.metadata()
           ])
             .then(values => {
               const sessionToken = values[0].sessionToken,
                     domain = values[1].settings.bloomfire_domain;
               return fetch(`https://${domain}/api/v2/questions/${questionID}/ask_to_answer?fields=id,contribution_type?session_token=${sessionToken}`, _.merge({}, fetchOpts, {
                        method: 'POST',
                        body: getFormDataFromJSON({ ask_to_answer_ids: answererIDs })
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
      this.submitForm(this.currentUserID) // submit form data
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
            this.props.createLinkedResource({
              display: true,
              id: data.id,
              public: false,
              title: this.state.question,
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
        <input type="text"
               name="question"
               value={this.state.question}
               placeholder={questionPlaceholder}
               className={classNameQuestion}
               onChange={this.handleChange}></input>
        <textarea name="explanation"
                  value={this.state.explanation}
                  placeholder="Explanation (optional)"
                  onChange={this.handleChange}/>
        <AskToAnswer client={this.props.client}
                     resize={this.props.resize}
                     answerers={this.state.answerers}
                     setAnswerers={this.setAnswerers}
                     setCurrentUserID={this.setCurrentUserID}
                     handleAPILock={this.props.handleAPILock}/>
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
