import React from 'react';
import ReactDOM from 'react-dom';

// components
import Search from './Search';
import LinkedResources from './LinkedResources';
import AddContent from './AddContent';
import {
  addHrefs,
  getResources,
  getResourceURL,
  getResourceAPIURL,
  encodeLinkedResources,
  decodeLinkedResources,
  trimResource,
  getSessionToken,
  getFromClientTicket
} from '../utils';



class App extends React.Component {

  constructor(props) {
    super(props);
    this.client = ZAFClient.init();
    this.resizeInterval = null;
    // state
    this.state = {
      searchResults: [], // results from either initial search or user-initiated search
      linkedResources: [] // list of linked resources
    };
    // bindings
    this.resize = this.resize.bind(this);
    this.createLinkedResource = this.createLinkedResource.bind(this);
    this.addLinkedResource = this.addLinkedResource.bind(this);
    this.removeLinkedResource = this.removeLinkedResource.bind(this);
    this.setSearchResults = this.setSearchResults.bind(this);
    // logging (for development)
    console.log(456);
    this.client.get('requirement:bloomfire_linked_resources').then(function(data) {
      console.dir(data);
    });
  }

  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this);
    this.lastHeight = this.node.clientHeight;
    this.populateLinkedResources();
  }

  // read linked resources from hidden ticket field and update state
  populateLinkedResources() {
    Promise.all([
      getFromClientTicket(this.client, 'customField:custom_field_54394587'),
      this.client.metadata()
    ])
      .then(values => {
        const resourceArr = decodeLinkedResources(values[0]['customField:custom_field_54394587']),
              domain = values[1].settings.bloomfire_domain;
        getResources(this.client, resourceArr)
          .then(linkedResources => {
            linkedResources = linkedResources.map(trimResource); // remove unnecessary properties
            addHrefs(domain, linkedResources);
            this.setState({ linkedResources });
          });
      });
  }

  setSearchResults(results) {
    const searchResults = this.hideLinkedResourcesInSearchResults(results);
    this.setState({ searchResults });
  }

  hideLinkedResourcesInSearchResults(results) {
    const searchResults = results.map((searchResult) => {
            for (let i = 0; i < this.state.linkedResources.length; i++) {
              if (this.state.linkedResources[i].id === searchResult.id) {
                searchResult.display = false; // set flag to hide in UI
                break;
              }
            }
            return searchResult;
          });
    return searchResults;
  }

  getZendeskTicket() {
    return getFromClientTicket(this.client, 'id')
             .then(data => this.client.request(`/api/v2/tickets/${data.id}.json`));
  };

  updateZendeskTicketCustomField(value) {
    return getFromClientTicket(this.client, 'id')
             .then(data => {
               return this.client.request({
                 url: `/api/v2/tickets/${data.id}.json`,
                 type: 'PUT',
                 dataType: 'json',
                 contentType: 'application/json',
                 data: JSON.stringify({
                   ticket: {
                     custom_fields: [
                       {
                         id: 54394587, // TODO: make dynamic
                         value
                       }
                     ]
                   }
                 })
               });
             });
  }

  getResourceArr(data) {
    const resourceTxt = _.result(_.find(data.ticket.custom_fields, field => {
      return field.id === 54394587; // TODO: make dynamic
    }), 'value');
    return decodeLinkedResources(resourceTxt);
  }

  findSearchResult(id) {
    return _.find(this.state.searchResults, result => result.id === id);
  }

  //
  setSearchResultDisplay(id, display) {
    const searchResults = this.state.searchResults.map((searchResult) => {
            if (searchResult.id === id) {
              searchResult.display = display; // set flag to hide or show in UI
            }
            return searchResult;
          });
    this.setState({ searchResults });
  }

  //
  createLinkedResource(resourceObj) {
    Promise.all([
      this.getZendeskTicket(),
      this.client.metadata()
    ])
      .then(values => {
        const ticketData = values[0],
              domain = values[1].settings.bloomfire_domain,
              linkedResources = [...this.state.linkedResources, {
                display: true,
                href: getResourceURL(domain, resourceObj.type, resourceObj.id),
                id: resourceObj.id,
                public: false,
                title: resourceObj.title,
                type: resourceObj.type,
              }];
        let resourceArr = this.getResourceArr(ticketData);
        resourceArr.push({
          type: resourceObj.type,
          id: resourceObj.id
        });
        this.updateZendeskTicketCustomField(encodeLinkedResources(resourceArr));
        this.setState({ linkedResources });
      })
  };

  //
  addLinkedResource(resourceObj) {
    this.createLinkedResource(this.findSearchResult(resourceObj.id));
    this.setSearchResultDisplay(resourceObj.id, false);
  }

  //
  removeLinkedResource(resourceObj) {
    this.getZendeskTicket() // load Zendesk ticket data from API
      .then(data => {
        let resourceArr = this.getResourceArr(data); // get array of linked resources
        resourceArr = _.reject(resourceArr, resource => resource.id === resourceObj.id); // remove the pertinent linked resource
        return this.updateZendeskTicketCustomField(encodeLinkedResources(resourceArr)); // save the new array of linked resources
      }).then(data => {
        const linkedResources = _.reject(this.state.linkedResources, linkedResource => linkedResource.id === resourceObj.id); // remove the pertinent linekd resource from the UI
        this.setState({ linkedResources });
        this.setSearchResultDisplay(resourceObj.id, true);
      });
  };

  resize() {
    if (this.node) { // if this component exists in the DOM, resize it
      const currentHeight = this.node.clientHeight;
      if (currentHeight !== this.lastHeight) {
        this.lastHeight = currentHeight;
        this.client.invoke('resize', {
          width: '100%',
          height: `${currentHeight}px`
        });
        clearInterval(this.resizeInterval);
      }
    } else if (!this.resizeInterval) { // if we're not already checking for this component to exist in the DOM
      this.resizeInterval = setInterval(this.resize.bind(this), 100); // start checking for DOM existence in order to resize
    }
  }

  render() {
    return (
      <main>
        <Search client={this.client}
                resize={this.resize}
                results={this.state.searchResults}
                setResults={this.setSearchResults}
                addLinkedResource={this.addLinkedResource}/>
        <LinkedResources client={this.client}
                         resize={this.resize}
                         links={this.state.linkedResources}
                         hasSearchResults={this.state.searchResults.length > 0}
                         removeLinkedResource={this.removeLinkedResource}/>
        <AddContent client={this.client}
                    resize={this.resize}
                    createLinkedResource={this.createLinkedResource}/>
      </main>
    );
  }

}



export default App;
