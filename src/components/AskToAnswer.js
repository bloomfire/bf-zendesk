import React from 'react';
import ReactDOM from 'react-dom';
import {
  fetchOpts,
  getTokens,
  getBloomfireUserIDByEmail
} from '../utils';

// components
import ReactTags from 'react-tag-autocomplete';



class AskToAnswer extends React.Component {

  constructor(props) {
    super(props);
    // state
    this.state = {
      suggestions: []
    };
    // bindings
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.props.resize();
    this.populateSuggestions();
    this.node = ReactDOM.findDOMNode(this);
    this.hackilyFixAskToAnswer();
  }

  componentDidUpdate() {
    this.props.resize();
  }

  // may be fixed by https://github.com/i-like-robots/react-tags/issues/52, which addresses https://github.com/i-like-robots/react-tags/issues/52
  // TODO: fork repo and apply PR, or wait for repo to accept PR
  hackilyFixAskToAnswer() {
    setTimeout(() => { // wait for event loop to turn
      const input = this.node.querySelector('.react-tags__search-input input');
      input.style.width = '302px';
    }, 0);
  }

  populateSuggestions() {
    Promise.all([
      getTokens(this.props.client),
      this.props.client.metadata(),
      this.props.client.get('currentUser.email') // get current user's email via Zendesk client SDK
        .then(data => data['currentUser.email']) // extract the returned property
        .then(data => getBloomfireUserIDByEmail(this.props.client, data, this.props.handleAPILock)) // look up current user's email via Bloomfire API
    ])
      .then(values => {
        const sessionToken = values[0].sessionToken,
              domain = values[1].settings.bloomfire_domain,
              currentUserID = values[2];
        fetch(`https://${domain}/api/v2/users?fields=active,id,first_name,last_name&limit=100&session_token=${sessionToken}`, fetchOpts)
          .then(this.props.handleAPILock) // handle 403/422 status codes
          .then(response => response.json())
          .then(users => {
            this.props.setCurrentUserID(currentUserID); // pass current user ID upstream to avoid an extra API request
            users = _.filter(users, user => user.active); // keep only active users
            users = _.reject(users, user => user.id === currentUserID); // remove current user (so they can't ask to answer their own question)
            users = users.map(user => ({
              id: user.id,
              name: `${user.first_name} ${user.last_name}`
            }));
            this.setState({ suggestions: users });
          })
          .catch(_.noop); // suppress error (no need to continue)
      });
  }

  handleDelete(i) {
    if (i > -1) {
      const answerers = [...this.props.answerers],
            removedAnswerer = answerers.splice(i, 1)[0],
            suggestions = [...this.state.suggestions, removedAnswerer]; // add the removed answerer back to the suggestions list
      this.setState({ suggestions });
      this.props.setAnswerers(answerers);
    }
  }

  handleAddition(answerer) {
    const answerers = this.props.answerers.concat(answerer),
          suggestions = _.reject(this.state.suggestions, suggestion => suggestion.id === answerer.id); // remove the answerer from the suggestions list so it can't be added twice
    this.setState({ suggestions });
    this.props.setAnswerers(answerers);
  }

  render() {
    const classNames = { root: 'react-tags last-field' };
    return (
      <ReactTags tags={this.props.answerers}
                 suggestions={this.state.suggestions}
                 placeholder="Ask member to answer (optional)"
                 autofocus={false}
                 minQueryLength={1}
                 maxSuggestionsLength={5}
                 handleAddition={this.handleAddition}
                 handleDelete={this.handleDelete}
                 classNames={classNames}/>
    );
  }

}



export default AskToAnswer;
