import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import {
  fetchOpts,
  normalizeResource,
  getTokens,
  addHrefs
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
    // properties
    this.resultsLimit = 30;
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

  getSearchResults(query, track) {
    return Promise.all([
             getTokens(this.props.client),
             this.props.client.metadata()
           ])
             .then(values => {
               const sessionToken = values[0].sessionToken,
                     domain = values[1].settings.bloomfire_domain,
                     trackParam = track ? '' : '&trk=false';
               return fetch(`https://${domain}/api/v2/search/facets/relevant?query=${encodeURIComponent(query)}&fields=results(instance(id,public,published,contribution_type,title,description,question,explanation,url))&limit=${this.resultsLimit}&session_token=${sessionToken}${trackParam}`, fetchOpts)
                        .then(this.props.handleAPILock) // handle 403/422 status codes
                        .then(response => response.json())
                        .then(data => {
                          return data.results.map(result => { // move properties of `data.result.instance` up to properties of `data.result`
                                   let obj = {};
                                   for (const key in result.instance) {
                                     obj[key] = result.instance[key];
                                   }
                                   return obj;
                                 })
                                 .filter(result => result.contribution_type === 'post' || result.contribution_type === 'question') // only keep Posts and Questions
                                 .filter(result => result.published) // remove unpublished results
                                 .map(normalizeResource);
                        })
                        .catch(_.noop); // suppress error (no need to continue)
             });
  }

  performInitialSearch() {
    this.setState({ processing: true });
    this.performSearchByDescription();
  }

  performSearchByQuery(query, track = true) {
    Promise.all([
      this.getSearchResults(query, track),
      this.props.client.metadata(),
      getTokens(this.props.client)
    ])
      .then(values => {
        const results = values[0],
              domain = values[1].settings.bloomfire_domain,
              loginToken = values[2].loginToken;
        if (typeof results !== 'undefined') { // we may have failed to get results (e.g., due to 403/422 status code)
          addHrefs(domain, results, loginToken);
          this.props.setResults(results);
          this.setState({ processing: false });
        }
      });
  }

  performSearchByDescription() {
    this
      .getTicketDescription()
      .then(query => {
        this.performSearchByQuery(query, false);
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
    let query = _.trim(this.state.value);
    if (query.length > 0) {
      this.performSearchByQuery(query);
    } else {
      this.performSearchByDescription();
    }
  }

  clearSearch(event) {
    this.setState({ value: '' });
  }

  render() {
    const resultsToShow = _.filter(this.props.results, result => result.display).length > 0,
          classNameMessage = classNames(
            'message',
            { 'no-results': !resultsToShow }
          ),
          classNameSubmit = classNames({ processing: this.state.searched && this.state.processing }),
          buttonLabel = this.state.searched && this.state.processing ? 'Searching' : 'Search';
    let message;
    if (this.state.searched) {
      message = resultsToShow ? 'The following results matched your search:' : 'No results found.';
    } else {
      message = resultsToShow ? 'You might find these resources helpful:' : 'No recommended resources found.';
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
          {(!this.state.processing && !this.state.searched && !resultsToShow) && <p className="sub-message">Try searching your community.</p>}
          {resultsToShow &&
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
