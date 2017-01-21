import React from 'react';

// components
import Results from './Results';



class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      query: '',
      results: []
    };
  }

  componentWillMount() {
    // fetch('https://rooms.bloomfire.ws/api/v2/search?query=video')
    //   .then(response => response.json())
    //   .then(data => { console.log(data); });
    console.log(this.props.query);
  }

  render() {
    return (
      <section className="search">
        <form>
          <input type="text" placeholder="Search your community"/>
          <input type="submit" value="Search"/>
        </form>
        <Results/>
      </section>
    );
  }

}



export default Search;
