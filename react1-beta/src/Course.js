import React from 'react';
// import { Container } from 'react-bootstrap';
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

  changeBg(){
    // update the new color if courses added
    document.getElementById("cartBg").style.background = "#dadfe1";
  }

  render() {
    return ( 
        <React.Fragment>
          <div class="bg-white border rounded mt-2 pb-4 px-2">
            <h2 class="primary mt-4 mb-0"><strong>
              {this.props.data.number}: {this.props.data.name}
            </strong></h2>
            <h4 class={this.props.cartMode ? "mt-0" : "mt-4"}>
              <strong>{this.props.cartMode ? this.props.data.credits+" Credits" : "Credits: " + this.props.data.credits }</strong>
              {/* Credits: {this.props.data.credits} */}
            </h4>
            <h4 class="mb-4" style={{display: this.props.cartMode ? "none": "block"}}>
              <strong>Subject: {this.props.data.subject}</strong>
            </h4>
            <p class="text-black-50" style={{display: this.props.cartMode ? "none": "block"}}>
              {this.props.data.description}
            </p>
            <p class="text-black-50 m-0" style={{display: this.props.cartMode ? "none": "block"}}>
              <strong>Requisites:</strong> {this.state.parsedReq}
            </p>
            <p class="text-black-50" style={{display: this.props.cartMode ? "none": "block"}}>            
              <strong>Keywords:</strong> {this.props.data.keywords.join(", ")}
            </p>

            {/* show section, add course */}
            <button className="rounded bg-light secondary font-weight-bold my-1" onClick={() => {this.props.courseCallback(this.props.data); this.changeBg();}}>{this.props.cartMode? "Remove Course" : "Add Course"}</button>
            <button class="bg-white rounded my-1" onClick={() => this.changeShow()} style={{display: this.props.cartMode ? "none": "block"}}>{this.state.showSection? "Hide Sections":"Show Sections"}</button>

            <div id={this.props.data.number} style={{display: this.state.showSection || this.props.cartMode ? "block": "none"}}>
              <table class="table-sm mx-0 my-2 w-100">
                <thead>
                  <tr class="back-primary">
                    <th>
                      Number
                    </th>
                    <th style={{display: this.props.cartMode ? "none": ""}}>
                      Instructor
                    </th>
                    <th style={{display: this.props.cartMode ? "none": ""}}>
                      Location
                    </th>
                    <th class={this.props.cartMode? "w-50" : "w-30"}>
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
          </div>
        </React.Fragment>            

    )
  }
}

export default Course;


