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
      addedWl: this.checkWL()
    };
  }

  checkWL() {
    if (this.props.cartMode && this.props.wishCourses) {
      let wished = this.props.wishCourses;
      for (var i = 0; i < wished.length; i++) {
        //  course added before, remove it
        if (wished[i].split(":")[0] === this.props.data.number) {
          return true;
        }
      }
    }
    return false;
  }

  // function to parse the prerequisties
  parseReq(data) {
    if (!data.length) {
      // no req
      return "None";
    }
    let arrToJoin = [];
    for (const cur in data) {
      arrToJoin.push(data[cur].join(" OR "));
    }

    return "(" + arrToJoin.join(") AND (") + ")";
  }

  // show sections of the course
  changeShow() {
    if (this.state.showSection)
      this.setState({ showSection: false });
    else
      this.setState({ showSection: true });
  }

  changeBg() {
    // update the new color if courses added
    document.getElementById("cartBg").style.background = "#dadfe1";
  }

  // change wl
  changeWL() {
    if (this.state.addedWl)
      this.setState({ addedWl: false });
    else
      this.setState({ addedWl: true });
  }

  courseToTake() {
    // find whether there are prereq not met
    // run through the prereq and check in completed courses
    if (this.props.cartMode === false) {
      return "";
    }
    // cart mode
    var courses = [];
    var preReq = Object.values(this.props.data.requisites);
    let completed = Object.values(this.props.compleCourses)[0];
    var prereqs = this.props.prereqs;

    var i, j, k, l;
    if (preReq.length) {
      // preReq is not null
      for (i = 0; i < preReq.length; i++) {
        var not_meet = [];
        for (j = 0; j < preReq[i].length; j++) {
          if (completed && completed.includes(preReq[i][j])) {
            continue;
          } else {
            not_meet.push(preReq[i][j]);
          }
        }
        if (not_meet.length) {
          // find the path
          for (k = 0; k < not_meet.length; k++) {
            var cur_not_meets = [not_meet[k]]
            var cur_added = ["(" + not_meet[k] + ")"]
            while (cur_not_meets.length) {
              // start with the first index
              var cur_not_meet = cur_not_meets[0];
              cur_not_meets.shift();

              // find the not completed prereq
              var cur_prereq = prereqs[cur_not_meet]

              for (const cur in cur_prereq) {
                for (l = 0; l < cur_prereq[cur].length; l++) {
                  // remove completed
                  if (completed && completed.includes(cur_prereq[cur][l])) {
                    cur_prereq[cur].splice(l, 1);
                  } else {
                    cur_not_meets.push(cur_prereq[cur][l]);
                  }
                }

                if (cur_prereq[cur].length === 0) {
                  cur_prereq.splice(cur, 1);
                }
              }

              if (cur_prereq.length) {
                cur_added.push(
                  this.parseReq(cur_prereq)
                )
              }
            }
            not_meet[k] = cur_added.join(" AFTER ");
          }
          courses.push(not_meet.join(") OR ("));
        }
      }
    } else {
      return "";
    }

    if (courses.length) {
      return "(" + courses.join(") AND (") + ")";
    } else {
      return "";
    }
  }

  componentDidUpdate() {
    // update whether in wishlist
    if (this.props.cartMode) {
      if (this.state.addedWl !== this.checkWL()) {
        this.setState({ addedWl: this.checkWL() })
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <div class="bg-white border rounded mt-2 pb-4 px-2">
          <h2 class="primary mt-4 mb-0"><strong>
            {this.props.data.number}: {this.props.data.name}
          </strong></h2>
          <h4 class={this.props.cartMode ? "mt-0" : "mt-4"}>
            <strong>{this.props.cartMode ? this.props.data.credits + " Credits" : "Credits: " + this.props.data.credits}</strong>
          </h4>
          {/* prereq and wishlist */}
          <h4 class="primary" style={{ display: this.props.cartMode && this.courseToTake().length ? "block" : "none" }}>
            You did not meet the prerequisties yet! <br class="mt-5" />
              Please complete {this.courseToTake()} before taking this course.
            </h4>
          <button className="rounded bg-light secondary font-weight-bold my-1" onClick={() => { this.props.wishCallback(this.props.data.number + ": " + this.props.data.name + ";" + this.courseToTake()); this.changeWL(); }}
            style={{ display: this.props.cartMode && this.courseToTake().length ? "block" : "none" }}>
            {this.state.addedWl ? "Remove from WishList" : "Add to WishList"}
          </button>

          <h4 class="mb-4" style={{ display: this.props.cartMode ? "none" : "block" }}>
            <strong>Subject: {this.props.data.subject}</strong>
          </h4>
          <p class="text-black-50" style={{ display: this.props.cartMode ? "none" : "block" }}>
            {this.props.data.description}
          </p>
          <p class="text-black-50 m-0" style={{ display: this.props.cartMode ? "none" : "block" }}>
            <strong>Requisites:</strong> {this.state.parsedReq}
          </p>
          <p class="text-black-50" style={{ display: this.props.cartMode ? "none" : "block" }}>
            <strong>Keywords:</strong> {this.props.data.keywords.join(", ")}
          </p>

          {/* show section, add course */}
          <button className="rounded bg-light secondary font-weight-bold my-1" onClick={() => { this.props.courseCallback(this.props.data); this.changeBg(); }}>{this.props.cartMode ? "Remove Course" : "Add Course"}</button>
          <button class="bg-white rounded my-1" onClick={() => this.changeShow()} style={{ display: this.props.cartMode ? "none" : "block" }}>{this.state.showSection ? "Hide Sections" : "Show Sections"}</button>

          <div id={this.props.data.number} style={{ display: this.state.showSection || this.props.cartMode ? "block" : "none" }}>
            <table class="table-sm mx-0 my-2 w-100">
              <thead>
                <tr class="back-primary">
                  <th>
                    Number
                    </th>
                  <th style={{ display: this.props.cartMode ? "none" : "" }}>
                    Instructor
                    </th>
                  <th style={{ display: this.props.cartMode ? "none" : "" }}>
                    Location
                    </th>
                  <th class={this.props.cartMode ? "w-50" : "w-30"}>
                    Meeting Times
                    </th>
                  <th>
                    Option
                    </th>
                </tr>
              </thead>
              <tbody>
                {this.props.data.sections.map(curSection => (
                  <Section key={this.props.data.number + curSection.number} data={curSection} id={this.props.data.number + ";" + curSection.number} cartMode={this.props.cartMode} sectionCallback={this.props.sectionCallbackPass} subSectionCallbackPass1={this.props.subSectionCallbackPass2} />
                ))}
              </tbody></table>
          </div>
        </div>
      </React.Fragment>

    )
  }
}

export default Course;


