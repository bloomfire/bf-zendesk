import React from 'react';
import ReactDOM from 'react-dom';

// components
import Search from './Search';
import LinkedResources from './LinkedResources';
import AddContent from './AddContent';
import {
  getResources,
  getResourceURL,
  getResourceAPIURL,
  encodeLinkedResources,
  decodeLinkedResources,
  trimResource
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
    console.log(3);
  }

  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this);
    this.lastHeight = this.node.clientHeight;
    this.populateLinkedResources();
  }

  populateLinkedResources() {
    this.getLinkedResourcesFromTicket()
      .then(resourceArr => resourceArr.map(getResourceAPIURL))
      .then(getResources)
      .then(linkedResources => {
        linkedResources = linkedResources.map(trimResource); // remove unnecessary properties
        this.setState({ linkedResources });
      });
  }

  setSearchResults(results) {
    this.setState({ searchResults: results });
  }

  getZendeskTicket() {
    return this.getFromTicket('id')
             .then(data => this.client.request(`/api/v2/tickets/${data.id}.json`));
  };

  updateZendeskTicketCustomField(value) {
    return this.getFromTicket('id')
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

  //
  createLinkedResource(resourceObj) {
    this.getZendeskTicket()
      .then(data => {
        let resourceArr = this.getResourceArr(data);
        resourceArr.push({
          type: resourceObj.type,
          id: resourceObj.id
        });
        return this.updateZendeskTicketCustomField(encodeLinkedResources(resourceArr));
      }).then(data => {
        const linkedResources = [...this.state.linkedResources, {
          display: true,
          id: resourceObj.id,
          public: false,
          title: resourceObj.title,
          type: resourceObj.type
        }];
        this.setState({ linkedResources });
      });
  };

  //
  addLinkedResource(resourceObj) {
    let chosenSearchResult;
    const searchResults = this.state.searchResults.map((searchResult) => {
            if (searchResult.id === resourceObj.id) {
              chosenSearchResult = _.cloneDeep(searchResult); // save a copy
              searchResult.display = false; // hide in search results
            }
            return searchResult;
          });
    this.createLinkedResource(chosenSearchResult);
    this.setState({ searchResults });
  }

  //
  // TODO: look for a matching id in searchResults and set display = true
  removeLinkedResource(resourceObj) {
    this.getZendeskTicket()
      .then(data => {
        let resourceArr = this.getResourceArr(data);
        resourceArr = _.reject(resourceArr, resource => resource.id === resourceObj.id);
        return this.updateZendeskTicketCustomField(encodeLinkedResources(resourceArr));
      }).then(data => {
        const linkedResources = _.reject(this.state.linkedResources, linkedResource => linkedResource.id === resourceObj.id);
        this.setState({ linkedResources });
      });
  };

  // convenience wrapper to this.client.get()
  getFromTicket(...paths) {
    paths = paths.map(path => `ticket.${path}`);
    return this.client.get(paths)
      .then(data => {
        let obj = {};
        for (let key in data) {
          if (key !== 'errors') { // discard errors object
            obj[key.slice(7)] = data[key]; // remove 'ticket.' prefix
          }
        }
        return obj;
      });
  }

  // TODO: replace call(s) to this with .getFromTicket('customField:custom_field_54394587')
  getLinkedResourcesFromTicket() {
    return this.client.get('ticket.customField:custom_field_54394587') // TODO: how to get custom field ID dynamically?
             .then(data => decodeLinkedResources(data['ticket.customField:custom_field_54394587']));
  }

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
                         removeLinkedResource={this.removeLinkedResource}/>
        <AddContent client={this.client}
                    resize={this.resize}
                    createLinkedResource={this.createLinkedResource}/>
      </main>
    );
  }

}



export default App;
