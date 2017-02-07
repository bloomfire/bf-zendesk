import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import {
  fetchOpts,
  getResources,
  trimResource
}  from '../utils';

// components
import LinkList from './LinkList';
import CloseIcon from './CloseIcon';



class Search extends React.Component {

  constructor(props) {
    super(props);
    // state
    this.state = {
      value: '', // from search input
      searched: false, // a user-initiated search has been performed (not still the initial search)
      processing: false // search is currently running
    };
    // bindings
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

  getSearchResults(query) {
    return fetch(`https://rooms.bloomfire.ws/api/v2/search?query=${encodeURIComponent(query)}`, fetchOpts)
             .then(response => response.json())
             .then(results => {
               const resourceURLs = results
                                      .filter(result => (result.type === 'post' || result.type === 'question'))
                                      .map(result => `https://rooms.bloomfire.ws/api/v2/${result.type}s/${result.instance.id}`)
               return getResources(resourceURLs);
             });
  }

  performInitialSearch() {
    this.setState({ processing: true });
    this
      .getTicketDescription()
      .then(this.getSearchResults.bind(this))
      .then(results => {
        results = _.filter(results, result => result.published); // remove unpublished results
        results = results.map(trimResource); // remove unnecessary properties
        this.props.setResults(results);
        this.setState({ processing: false });
      });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.setResults([]);
    this.setState({
      searched: true,
      processing: true
    });
    this.getSearchResults(this.state.value)
      .then(results => {
        this.props.setResults(results);
        this.setState({ processing: false });
      });
  }

  clearSearch(event) {
    this.setState({ value: '' });
  }

  render() {
    const resultsExist = this.props.results.length > 0,
          classNameMessage = classNames(
            'message',
            { 'no-results': !resultsExist }
          ),
          classNameSubmit = classNames({ processing: this.state.searched && this.state.processing }),
          buttonLabel = this.state.searched && this.state.processing ? 'Searching' : 'Search';
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
            <input type="text"
                   value={this.state.value}
                   onChange={this.handleChange}
                   placeholder="Search your community"/>
            <CloseIcon handleClick={this.clearSearch}
                       active={this.state.value.length > 0}/>
          </div>
          <input type="submit"
                 value={buttonLabel}
                 className={classNameSubmit}/>
        </form>
        <div className="results">
          {!this.state.processing && <p className={classNameMessage}>{message}</p>}
          {(!this.state.processing && !this.state.searched && !resultsExist) && <p className="sub-message">Try searching your community.</p>}
          {this.props.results.length > 0 &&
            <div className="content-box">
              <LinkList links={this.props.results}
                        includeBrokenLink={false}
                        handleClick={this.props.addLinkedResource}/>
            </div>
          }
        </div>
      </section>
    );
  }

}



export default Search;
