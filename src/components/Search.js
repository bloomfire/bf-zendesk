import React from 'react';
import _ from 'lodash';
import { fetchOpts }  from '../utils';

// components
import Results from './Results';
import CloseIcon from './CloseIcon';



class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      results: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }

  componentWillMount() {
    // fetch('https://rooms.bloomfire.ws/api/v2/search?query=video')
    //   .then(response => response.json())
    //   .then(data => { console.log(data); });
    this.performInitialSearch();
  }

  getTicketDescription() {
    return this.props.client
             .get('ticket.description')
             .then(data => _.trim(data['ticket.description']));
  }

  getResources(results) {
    console.log(results);
    const resourceURLs = results
                           .filter(result => result.type === 'post' || result.type === 'question')
                           .map(result => `https://rooms.bloomfire.ws/api/v2/${result.type}s/${result.instance.id}`)
                           .slice(0, 5),
          resourceReqs = resourceURLs
                           .map(resourceURL => fetch(resourceURL, fetchOpts).then(response => response.json()));
    console.log(resourceURLs);
    return Promise.all(resourceReqs);
  }

  getSearchResults(query) {
    return fetch(`https://rooms.bloomfire.ws/api/v2/search?query=${encodeURIComponent(query)}`, fetchOpts)
             .then(response => response.json())
             .then(this.getResources.bind(this));
  }

  performInitialSearch() {
    this
      .getTicketDescription()
      .then(this.getSearchResults.bind(this))
      .then(results => {
        console.log(results);
        this.setState({ results });
      });
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.getSearchResults(this.state.value)
      .then(results => {
        console.log(results);
        this.setState({ results });
      });
  }

  clearSearch(event) {
    this.setState({
      value: ''
    });
  }

  render() {
    return (
      <section className="search">
        <form onSubmit={this.handleSubmit}>
          <div className="input-group">
            <input type="text" value={this.state.value} onChange={this.handleChange} placeholder="Search your community"/>
            <CloseIcon handleClick={this.clearSearch} active={this.state.value.length > 0}/>
          </div>
          <input type="submit" value="Search"/>
        </form>
        <Results results={this.state.results}/>
      </section>
    );
  }

}



export default Search;
