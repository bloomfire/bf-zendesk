import React from 'react';
import ReactDOM from 'react-dom';
import {
  fetchOpts,
  getSessionToken
} from '../utils';

// components
import ReactTags from 'react-tag-autocomplete';



class AskToAnswer extends React.Component {

  constructor(props) {
    super(props);
    // state
    this.state = {
      suggestions: [],
      tags: []
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
      getSessionToken(this.props.client),
      this.props.client.metadata()
    ])
      .then(values => {
        const token = values[0],
              domain = values[1].settings.bloomfire_domain;
        fetch(`https://${domain}/api/v2/users?fields=active,id,first_name,last_name&session_token=${token}`, fetchOpts)
          .then(response => response.json())
          .then(users => {
            users = _.filter(users, user => user.active); // remove inactive users
            users = users.map(user => ({
              id: user.id,
              name: `${user.first_name} ${user.last_name}`
            }));
            this.setState({ suggestions: users });
          });
      });
  }

  handleDelete(i) {
    const tags = this.state.tags.slice(0),
          removedTag = tags.splice(i, 1)[0];
    this.setState({
      suggestions: [...this.state.suggestions, removedTag], // add the removed tag back to the suggestions list
      tags
    });
  }

  handleAddition(tag) {
    const tags = this.state.tags.concat(tag),
          suggestions = _.reject(this.state.suggestions, suggestion => suggestion.id === tag.id); // remove the tag from the suggestions list so it can't be added twice
    this.setState({
      suggestions,
      tags
    });
  }

  render() {
    const classNames = { root: 'react-tags last-field' };
    return (
      <ReactTags tags={this.state.tags}
                 suggestions={this.state.suggestions}
                 placeholder="Ask member to answer (optional)"
                 autofocus={false}
                 minQueryLength={1}
                 maxSuggestionsLength={1}
                 handleAddition={this.handleAddition}
                 handleDelete={this.handleDelete}
                 classNames={classNames}/>
    );
  }

}



export default AskToAnswer;
