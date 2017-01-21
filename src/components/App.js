import React from 'react';

// components
import Search from './Search';
import LinkedResources from './LinkedResources';
import AddContent from './AddContent';



class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      description: ''
    };
  }

  getTicketDescription() {
    this.client.get('ticket.description').then((data) => {
      this.setState({
        description: data['ticket.description']
      });
    });
  }

  componentWillMount() {
    this.client = ZAFClient.init();
    this.getTicketDescription();
  }

  render() {
    return (
      <main>
        <Search query={this.state.description}/>
        <LinkedResources/>
        <AddContent/>
      </main>
    );
  }

}



export default App;
