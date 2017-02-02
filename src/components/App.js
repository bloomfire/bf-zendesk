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
  // TODO: add using API, not client SDK
  // TODO: also add to this.state.linkedResources
  addLinkedResource(resourceObj) {
    this.getFromTicket('id', 'customField:custom_field_54394587')
      .then(ticketData => {
        console.log(1);
        console.log(ticketData);
        let resourceArr = decodeLinkedResources(ticketData['customField:custom_field_54394587']);
        resourceArr.push({
          type: resourceObj.type,
          id: resourceObj.id
        });
        console.log(4);
        console.log(resourceArr);
        this.client.request({
          url: `/api/v2/tickets/${ticketData.id}.json`,
          type: 'PUT',
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
        }).then(data => { console.log(2); console.log(data); });
        // this.client.set('ticket.customField:custom_field_54394587', encodeLinkedResources(resourceArr));
      });
  };

  //
  removeLinkedResource(resourceObj) {

  };

  // convenience wrapper to this.client.get()
  getFromTicket(...paths) {
    paths = paths.map(path => `ticket.${path}`);
    console.log(paths);
    return this.client.get(paths)
      .then(data => {
        console.log(data);
        let obj = {};
        for (let key in data) {
          obj[key.slice(7)] = data[key]; // remove 'ticket.' prefix
        }
        console.log(obj);
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
