import React from 'react';

// components
import Search from './Search';
import Resources from './Resources';
import Tabs from './Tabs';
import Post from './Post';
import Question from './Question';



class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      description: ''
    };
  }

  getTicketDescription() {
    this.client.get('ticket.description').then((data) => {
      this.setState({ description: data['ticket.description'] });
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
        <Resources/>
        <Tabs/>
        <Post/>
        <Question/>
      </main>
    );
  }

}



export default App;
