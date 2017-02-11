import React from 'react';
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
  }

  componentDidUpdate() {
    this.props.resize();
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
    let tags = this.state.tags.slice(0);
    tags.splice(i, 1);
    this.setState({ tags });
  }

  handleAddition(tag) {
    const tags = this.state.tags.concat(tag);
    this.setState({ tags });
  }

  render() {
    return (
      <ReactTags tags={this.state.tags}
                 suggestions={this.state.suggestions}
                 placeholder="Ask member to answer (optional)"
                 autofocus={false}
                 minQueryLength={1}
                 maxSuggestionsLength={3}
                 handleAddition={this.handleAddition}
                 handleDelete={this.handleDelete}
                 className="last-field"/>
    );
  }

}



export default AskToAnswer;



// <input type="text"
//        name="answerers"
//        value={this.state.answerers}
//        placeholder="Ask member to answer (optional)"
//        className="last-field"
//        onChange={this.handleChange}/>
