import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

class CompletedCourse extends React.Component {
  constructor(props) {
    super(props);
    this.rating = React.createRef();
    this.state = {
      ratings: ["No Rating", "1", "2", "3", "4", "5"],
    }
  }

  getRatingOptions() {
    let ratingOptions = [];

    var i;
    for (i = 0; i < this.state.ratings.length; i++) {
      ratingOptions.push(<option key={this.props.data.number + "_ratings_" + i.toString()}>{this.state.ratings[i]}</option>);
    }

    return ratingOptions;
  }

  render() {
    return (
      <React.Fragment>
        <Card class="m-1 p-0 bg-light rounded">
          <Card.Body >
            <h4 class="mt-0">
              {this.props.data.number}: {this.props.data.name}
            </h4>
            <Form.Group controlId={"rating_" + this.props.data.number}>
              <Form.Label>Rating</Form.Label>
              <Form.Control as="select" ref={this.rating} onChange={() => { this.props.ratingCallback(this.props.data.number + ":" + this.rating.current.value) }}>
                {this.getRatingOptions()}
              </Form.Control>
            </Form.Group>
          </Card.Body>
        </Card>

      </React.Fragment>
    )
  }
}

export default CompletedCourse;