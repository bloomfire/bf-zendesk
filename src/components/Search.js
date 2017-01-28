import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import { fetchOpts }  from '../utils';

// components
import LinkList from './LinkList';
import CloseIcon from './CloseIcon';



class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '', // from search input
      results: [], // results from either initial search or user-initiated search
      searched: false, // user-initiated search performed (not initial search)
      searching: true // search is currently running
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }

  componentDidMount() {
    this.performInitialSearch();
    this.props.resize();
  }

  componentDidUpdate() {
    this.props.resize();
  }

  getTicketDescription() {
    return this.props.client
             .get('ticket.description')
             .then(data => _.trim(data['ticket.description']));
  }

  getResources(results) {
    // console.log(results);
    const resourceURLs = results
                           .filter(result => result.type === 'post' || result.type === 'question')
                           .map(result => `https://rooms.bloomfire.ws/api/v2/${result.type}s/${result.instance.id}`)
                           .slice(0, 5),
          resourceReqs = resourceURLs
                           .map(resourceURL => fetch(resourceURL, fetchOpts).then(response => response.json()));
    // console.log(resourceURLs);
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
        // console.log(results);
        this.setState({
          results,
          searching: false
        });
      });
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      results: [],
      searched: true,
      searching: true
    });
    this.getSearchResults(this.state.value)
      .then(results => {
        // console.log(results);
        this.setState({
          results,
          searching: false
        });
      });
  }

  clearSearch(event) {
    this.setState({
      value: ''
    });
  }

  render() {
    const resultsExist = this.state.results.length > 0,
          classNameMessage = classNames(
            'message',
            { 'no-results': !resultsExist }
          ),
          classNameSubmit = classNames({ searching: this.state.searched && this.state.searching });
    let message;
    if (this.state.searched) {
      message = resultsExist ? 'The following results matched your search:' : 'No results found.';
    } else {
      message = resultsExist ? 'You might find these resources helpful:' : 'No recommended resources found.';
    }
    return (
      <section className="search">
        <form onSubmit={this.handleSubmit}>
          <div className="input-group">
            <input type="text" value={this.state.value} onChange={this.handleChange} placeholder="Search your community"/>
            <CloseIcon handleClick={this.clearSearch} active={this.state.value.length > 0}/>
          </div>
          <input type="submit" value="Search" className={classNameSubmit}/>
        </form>
        <div className="results">
          {!this.state.searching && <p className={classNameMessage}>{message}</p>}
          {(!this.state.searching && this.state.searched && !resultsExist) && <p className="sub-message">Try searching your community.</p>}
          <LinkList links={this.state.results}/>
        </div>
      </section>
    );
  }

}



export default Search;
