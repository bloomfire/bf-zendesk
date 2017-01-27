import React from 'react';

// components
import Search from './Search';
import LinkedResources from './LinkedResources';
import AddContent from './AddContent';



class App extends React.Component {

  constructor(props) {
    super(props);
    this.client = ZAFClient.init();
    // this.resize();
  }

  // resize() {
  //   window.addEventListener('resize', (event) => {
  //     this.client.invoke('resize', {
  //       width: '100%',
  //       height: `${document.body.clientHeight}px`
  //     });
  //   });
  // }

  render() {
    return (
      <main>
        <Search client={this.client}/>
        <LinkedResources client={this.client}/>
        <AddContent client={this.client}/>
      </main>
    );
  }

}



export default App;
