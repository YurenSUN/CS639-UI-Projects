import React from 'react';
import './App.css';
import Section from './Section'

class Course extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      parsedReq: this.parseReq(this.props.data.requisites),
      showSection: false,
  }; }

  // function to parse the prerequisties
  parseReq(data) {
    if (!data.length){
      // no req
      return "None";
    }
    let arrToJoin = [];
    for (const cur in data){
      arrToJoin.push(data[cur].join(" OR "));
    }

    return "(" + arrToJoin.join(") AND (") + ")";
  }

  // show sections of the course
  changeShow(){
    if (this.state.showSection)
      this.setState({ showSection: false });
    else
      this.setState({ showSection: true });
  }

  render() {
    return ( 
        <React.Fragment>
          <h2>
            {this.props.data.number}: {this.props.data.name}
          </h2>
          <h4>
            Credits: {this.props.data.credits}
          </h4>
          <h4>
            Subject: {this.props.data.subject}
          </h4>
          <p>
            {this.props.data.description}
          </p>
          <p>
            <strong>Requisites:</strong> {this.state.parsedReq}
          </p>
          <p>
          <strong>Keywords:</strong> {this.props.data.keywords.join(", ")}
          </p>

          {/* show section, add course */}
          <button className={"addBtn"} onClick={() => this.props.courseCallback(this.props.data)}>{this.props.cartMode? "Remove Course" : "Add Course"}</button>
          <button onClick={() => this.changeShow()} style={{display: this.props.cartMode ? "none": "block"}}>{this.state.showSection? "Hide Sections":"Show Sections"}</button>

          <div id={this.props.data.number} style={{display: this.state.showSection || this.props.cartMode ? "block": "none"}}>
            <table>
              <thead>
                <tr style={{backgroundColor: 'lightGrey'}}>
                  <th>
                    Number
                  </th>
                  <th>
                    Instructor
                  </th>
                  <th>
                    Location
                  </th>
                  <th>
                    Meeting Times
                  </th>
                  <th>
                    Option
                  </th>
                </tr>
              </thead>
            <tbody>
            {this.props.data.sections.map(curSection => (
              <Section key={this.props.data.number + curSection.number} data={curSection} id={this.props.data.number + ";" + curSection.number} cartMode={this.props.cartMode} sectionCallback={this.props.sectionCallbackPass} subSectionCallbackPass1={this.props.subSectionCallbackPass2}/>
            ))}
            </tbody></table>
          </div>
          
        </React.Fragment>            

    )
  }
}

export default Course;


