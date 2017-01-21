import React from 'react';

// components
import Tabs from './Tabs';
import Post from './Post';
import Question from './Question';
import { Caret } from './functional';



class AddContent extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="add-content">
        <h2>Add content to Bloomfire</h2>
        <Caret/>
        <Tabs/>
        <Post/>
        <Question/>
      </section>
    );
  }

}



export default AddContent;
