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
  }

  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this);
    this.lastHeight = this.node.clientHeight;
    this.getLinkedResources();
  }

  getLinkedResources() {
    this.client.get('ticket.customField:custom_field_54394587').then(data => { // TODO: how to get custom field ID dynamically?
      const resourceArr = decodeLinkedResources(data['ticket.customField:custom_field_54394587']),
            linkedResourceAPIURLs = resourceArr.map(resource => getResourceAPIURL(resource.type, resource.id));
      getResources(linkedResourceAPIURLs).then(linkedResources => {
        this.setState({ linkedResources });
      });
    });
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
                    resize={this.resize}/>
      </main>
    );
  }

}



export default App;
