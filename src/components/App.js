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
  decodeLinkedResources
} from '../utils';



class App extends React.Component {

  constructor(props) {
    super(props);
    this.client = ZAFClient.init();
    this.resizeInterval = null;
    // state
    this.state = {
      linkedResources: []
    };
    // bindings
    this.resize = this.resize.bind(this);
    this.addLinkedResource = this.addLinkedResource.bind(this);
    console.log(1);
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
        this.setState({ linkedResources });
      });
  }

  //
  // TODO: also add to this.state.linkedResources
  addLinkedResource(resourceObj, title) {
    let ticketId;
    this.getFromTicket('id')
      .then(data => {
        ticketId = data.id;
        return this.client.request(`/api/v2/tickets/${ticketId}.json`);
      })
      .then(data => {
        const resourceTxt = _.result(_.find(data.ticket.custom_fields, field => {
          return field.id === 54394587; // TODO: make dynamic
        }), 'value');
        let resourceArr = decodeLinkedResources(resourceTxt);
        resourceArr.push({
          type: resourceObj.type,
          id: resourceObj.id
        });
        return this.client.request({
          url: `/api/v2/tickets/${ticketId}.json`,
          type: 'PUT',
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify({
            ticket: {
              custom_fields: [
                {
                  id: 54394587, // TODO: make dynamic
                  value: encodeLinkedResources(resourceArr)
                }
              ]
            }
          })
        });
      }).then(data => {
        this.setState({
          linkedResources: [...this.state.linkedResources, {
            id: resourceObj.id,
            contribution_type: resourceObj.type,
            title,
            public: false
          }]
        });
      });
  };

  //
  removeLinkedResource(resourceObj) {

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
                resize={this.resize}/>
        <LinkedResources client={this.client}
                         resize={this.resize}
                         links={this.state.linkedResources}/>
        <AddContent client={this.client}
                    resize={this.resize}
                    addLinkedResource={this.addLinkedResource}/>
      </main>
    );
  }

}



export default App;
