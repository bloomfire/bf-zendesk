import React from 'react';



class Question extends React.Component {

  render() {
    return (
      <section className="question">
        <form>
          <textarea name="question" placeholder="Question"></textarea>
          <input type="text" name="description" placeholder="Description (optional)"/>
          <input type="text" name="answerer" placeholder="Assign an Answerer"/>
          <p className="link-to-ticket">
            <input type="checkbox" name="link" id="link-question"/>
            <label htmlFor="link-question">Link Question to Ticket</label>
          </p>
          <input type="submit" name="publish" value="Publish"/>
        </form>
      </section>
    );
  }

}



export default Question;
