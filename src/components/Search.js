import React from 'react';

// components
import Results from './Results';



class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      results: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    // fetch('https://rooms.bloomfire.ws/api/v2/search?query=video')
    //   .then(response => response.json())
    //   .then(data => { console.log(data); });
    console.log(this.props.query);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state.value);
  }

  render() {
    return (
      <section className="search">
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.value} onChange={this.handleChange} placeholder="Search your community"/>
          <input type="submit" value="Search"/>
        </form>
        <Results/>
      </section>
    );
  }

}



export default Search;
