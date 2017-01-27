import React from 'react';
import ReactDOM from 'react-dom';

// components
import Search from './Search';
import LinkedResources from './LinkedResources';
import AddContent from './AddContent';



class App extends React.Component {

  constructor(props) {
    super(props);
    this.client = ZAFClient.init();
    this.resize = this.resize.bind(this);
  }

  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this);
    this.lastHeight = this.node.clientHeight;
  }

  resize() {
    if (this.node) {
      const currentHeight = this.node.clientHeight;
      if (currentHeight !== this.lastHeight) {
        this.lastHeight = currentHeight;
        this.client.invoke('resize', {
          width: '100%',
          height: `${currentHeight}px`
        });
      }
    }
  }

  render() {
    return (
      <main>
        <Search client={this.client} resize={this.resize}/>
        <LinkedResources client={this.client} resize={this.resize}/>
        <AddContent client={this.client} resize={this.resize}/>
      </main>
    );
  }

}



export default App;
