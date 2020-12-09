import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import SearchAndFilter from './SearchAndFilter';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.searchAndFilter = new SearchAndFilter();
    this.subject = React.createRef();
    this.minimumCredits = React.createRef();
    this.maximumCredits = React.createRef();
    this.search = React.createRef();
    this.interest = React.createRef();
  }

  setCourses() {
    this.props.setCourses(this.searchAndFilter.searchAndFilter(this.props.courses, this.search.current.value, this.subject.current.value, this.minimumCredits.current.value, this.maximumCredits.current.value, this.interest.current.value));
  }

  handleCreditsKeyDown(e) {
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'].indexOf(e.key) === -1)
      e.preventDefault();
  }

  getSubjectOptions() {
    let subjectOptions = [];

    for (const subject of this.props.subjects) {
      subjectOptions.push(<option key={subject}>{subject}</option>);
    }

    return subjectOptions;
  }

  getInterestOptions() {
    let interestOptions = [];

    for (const interest of this.props.interests) {
      interestOptions.push(<option key={"interest_" + interest}>{interest}</option>);
    }

    return interestOptions;
  }

  render() {
    return (
      <>
        {/* search and filter */}
        <Card class="m-0 p-0 bg-light" style={{ borderWidth: "0" }}>
          <Card.Body class="bg-light">
            <h3 class="m-0 p-0"><strong>Search and Filter</strong></h3>
            <Form>
              <Form.Group controlId="formKeywords" onChange={() => this.setCourses()} style={{ width: '100%' }}>
                <Form.Label>Search</Form.Label>
                <Form.Control type="text" placeholder="Search" autoComplete="off" ref={this.search} />
              </Form.Group>

              <Form.Group controlId="formSubject">
                <Form.Label>Subject</Form.Label>
                <Form.Control as="select" ref={this.subject} onChange={() => this.setCourses()}>
                  {this.getSubjectOptions()}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formInterests">
                <Form.Label>Interest</Form.Label>
                <Form.Control as="select" ref={this.interest} onChange={() => this.setCourses()}>
                  {this.getInterestOptions()}
                </Form.Control>
              </Form.Group>

              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Form.Group controlId="minimumCredits" onChange={() => this.setCourses()} onKeyDown={(e) => this.handleCreditsKeyDown(e)}>
                  <Form.Label>Credits</Form.Label>
                  <Form.Control type="text" placeholder="Min" autoComplete="off" ref={this.minimumCredits} />
                </Form.Group>
                <div style={{ marginLeft: '5px', marginRight: '5px', marginTop: '38px' }}>to</div>
                <Form.Group controlId="maximumCredits" style={{ marginTop: '32px' }} onChange={() => this.setCourses()} onKeyDown={(e) => this.handleCreditsKeyDown(e)}>
                  <Form.Control type="text" placeholder="Max" autoComplete="off" ref={this.maximumCredits} />
                </Form.Group>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </>
    )
  }
}

export default Sidebar;
