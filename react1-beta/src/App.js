import React from 'react';
import './App.css';
// import Tabs from 'react-bootstrap/Tabs'
// import Tab from 'react-bootstrap/Tab'
import Sidebar from './Sidebar';
import CourseArea from './CourseArea';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: {},
      filteredCourses: {},
      subjects: [],
      addedCourses: [],
    };
  }

  componentDidMount() {
    fetch('http://mysqlcs639.cs.wisc.edu:53706/api/react/classes').then(
      res => res.json()
    ).then(data => this.setState({allCourses: data, filteredCourses: data, subjects: this.getSubjects(data)}));
  }

  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for(const course of Object.values(data)) {
      if(subjects.indexOf(course.subject) === -1)
        subjects.push(course.subject);
    }

    return subjects;
  }

  setCourses(courses) {
    this.setState({filteredCourses: courses});
  }

  // to add course
  // input: the course json object
  addCourse(course) {
    // check whether the course was added before
    var joined = this.state.addedCourses;
    var added = 0;
    for (const index in joined){
      //  course added before
      if (joined[index].number === course.number){
        joined[index] = course;
        added = 1;
      }
    }

    if (!added){
      // course not added before
      joined = joined.concat(course);
    }

    this.setState({ addedCourses: joined })
  }

  // to add subsection
  // input string: course number;section number;subsection number
  addSubSection(subSection){
    // split to get course, section, subsetion number
    var splited = subSection.split(";");
    var courseNum = splited[0];
    var sectionNum = splited[1];
    var subSecNum = splited[2];

    // get the data for current course
    var curCourse;
    var curSec;
    var curSubSec;
    var i, j, k;
    for (i = 0; i< this.state.allCourses.length; i ++ ){
      if (this.state.allCourses[i].number === courseNum){
        curCourse = JSON.parse(JSON.stringify(this.state.allCourses[i]));
        for (j = 0; j < curCourse.sections.length; j++){
          if (curCourse.sections[j].number === sectionNum){
            curSec = JSON.parse(JSON.stringify(curCourse.sections[j]));
            for (k = 0; k < curSec.subsections.length; k ++){
              if (curSec.subsections[k].number === subSecNum){
                curSubSec = JSON.parse(JSON.stringify(curSec.subsections[k]));
                curSec.subsections = [JSON.parse(JSON.stringify(curSec.subsections[k]))];
                curCourse.sections = [JSON.parse(JSON.stringify(curSec))];
                break;
              }
            }
            break;
          }
        }
        break;
      }
    }

    
    // traverse through the addedCourse to see whether current course exist
    var joined = this.state.addedCourses;
    var added = 0;
    for (i = 0; i< joined.length; i ++ ){
      //  course added before
      if (joined[i].number === courseNum){
        // cur course exist, check section
        for (j = 0; j< joined[i].sections.length; j ++){
          if(joined[i].sections[j].number === sectionNum){
            // cur section exist, check subsection
            for (k = 0; k< joined[i].sections[j].subsections.length; k ++){
              if (joined[i].sections[j].subsections[k].number === subSecNum){
                added = 1;
                break;
              }
            }
            if (!added){
              // add the subsection
              joined[i].sections[j].subsections[joined[i].sections[j].subsections.length] = curSubSec;
              added = 1;
            }
            break;
          }
        }
        // cur course exist, section and subsection not exist
        if (!added){
          joined[i].sections[joined[i].sections.length] = curSec;
          added = 1;
        }
        break;
      }
    }
    if (!added){
      // not added before
      joined = joined.concat(curCourse);
    }

    this.setState({ addedCourses: joined });
  }

  // to add section
  // input string: course number;section number
  addSection(section){
    var splited = section.split(";");
    var courseNum = splited[0];
    var sectionNum = splited[1];

    // get the data for current course
    var curCourse;
    var curSec;
    var i, j;
    for (i = 0; i< this.state.allCourses.length; i ++ ){
      if (this.state.allCourses[i].number === courseNum){
        curCourse = JSON.parse(JSON.stringify(this.state.allCourses[i]));
        for (j = 0; j < curCourse.sections.length; j++){
          if (curCourse.sections[j].number === sectionNum){
            curSec = JSON.parse(JSON.stringify(curCourse.sections[j]));
            curCourse.sections = [JSON.parse(JSON.stringify(curSec))];
            break;
          }
        }
        break;
      }
    }

    // traverse through the addedCourse to see whether current course exist
    var joined = this.state.addedCourses;
    var added = 0;
    for (i = 0; i< joined.length; i ++ ){
      //  course added before
      if (joined[i].number === courseNum){
        // cur course exist, check section
        for (j = 0; j< joined[i].sections.length; j ++){
          if(joined[i].sections[j].number === sectionNum){
            // section exist, replace with the whole section
            joined[i].sections[j] = curSec;
            added = 1;
            break;
          }
        }
        // cur course exist, section and subsection not exist
        if (!added){
          joined[i].sections[joined[i].sections.length] = curSec;
          added = 1;
        }
        break;
      }
    }
    if (!added){
      // not added before
      joined = joined.concat(curCourse);
    }

    this.setState({ addedCourses: joined });
  }

  // to remove course
  // input the course json object
  remCourse(course){
    var ori = this.state.addedCourses;
    var removed = [];
    var i;
    for (i = 0; i < ori.length; i ++){
      //  course added before
      if ( ori[i].number !== course.number){
        // not the course to delete
        removed.push(ori[i]);
      }
    }

    this.setState({ addedCourses: removed })
  }

  // to remove section
  // input string: course number;section number
  remSection(section){
    var splited = section.split(";");
    var courseNum = splited[0];
    var sectionNum = splited[1];
    
    var ori = this.state.addedCourses;
    var removed = [];
    var remCourse;

    var i, j;
    for (i = 0; i< ori.length; i ++ ){
      //  course added before
      if (ori[i].number === courseNum){
        remCourse = JSON.parse(JSON.stringify(ori[i]));
        remCourse.sections = [];
        // the course to remove section, keep the section not to remove
        for (j = 0; j< ori[i].sections.length; j ++){
          // add section not to remove
          if(ori[i].sections[j].number !== sectionNum){
            remCourse.sections[remCourse.sections.length] = ori[i].sections[j];
          }
        }
        // if no section left, delete course
        if (remCourse.sections.length){
          removed.push(remCourse)
        }
      }else{
        // not the course to remove section
        removed.push(ori[i])
      }
    }
    this.setState({ addedCourses: removed })
  }

  // to remove subsection
  // input string: course number;section number;subsection number
  remSubSection(subsection){
    // split to get course, section, subsetion number
    var splited = subsection.split(";");
    var courseNum = splited[0];
    var sectionNum = splited[1];
    var subSecNum = splited[2];

    var ori = this.state.addedCourses;
    var removed = [];
    var remCourse;
    var remSection;

    // traverse through the addedCourse to see whether current course exist
    var i,j,k;
    for (i = 0; i< ori.length; i ++ ){
      //  course added before
      if (ori[i].number === courseNum){
        // cur course exist, keep sections not to remove
        remCourse = JSON.parse(JSON.stringify(ori[i]));
        remCourse.sections = [];
        for (j = 0; j< ori[i].sections.length; j ++){
          if(ori[i].sections[j].number === sectionNum){
            // cur section, keep subsection not to remove
            remSection = JSON.parse(JSON.stringify(ori[i].sections[j]));
            remSection.subsections = [];
            for (k = 0; k< ori[i].sections[j].subsections.length; k ++){
              if (ori[i].sections[j].subsections[k].number !== subSecNum){
                remSection.subsections[remSection.subsections.length] = ori[i].sections[j].subsections[k];
              }
            }
            // if no subsection left, delete section
            if (remSection.subsections.length){
              remCourse.sections[remCourse.sections.length] = remSection;
            }
          }else{
            remCourse.sections[remCourse.sections.length] = ori[i].sections[j];
          }
        }
        // if no section left, delete course
        if (remCourse.sections.length){
          removed.push(remCourse)
        }
      }else{
        // course not to remove
        removed.push(ori[i]);
      }
    }

    this.setState({ addedCourses: removed });
  }


  render() {
    return (
      <React.Fragment>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />
        <header class="navbar navbar-expand-md bg-light pl-3 pt-3" style={{height: "5vh"}}>
            <h1 class="header-text">Course Search</h1>
        </header>

        <div class="container-fluid m-0 p-0 overflow-hidden bg-light" style={{height: "95vh"}}>
          <div class="row m-0 p-0 vh-100">
            <div class="col-md-8 p-0 m-0 overflow-hidden vh-100">
              <div class="row p-0 m-0">
                <div class="col-3 border overflow-auto vh-100 pt-2 px-2">
                  <Sidebar setCourses={(courses) => this.setCourses(courses)} courses={this.state.allCourses} subjects={this.state.subjects}/>
                </div>
                <div class="col-9 border overflow-auto vh-100 pt-2 pb-5 px-3" >
                    <CourseArea data={this.state.filteredCourses} allData={this.state.allCourses} addSubSection={this.addSubSection.bind(this)} addSection={this.addSection.bind(this)} addCourse={this.addCourse.bind(this)} cartMode={false}/>
                </div>
              </div>
            </div>
            <div id="cartBg" class="col-md-4 border overflow-auto vh-100 pt-2 pb-5 px-3">
                <CourseArea data={this.state.addedCourses} allData={this.state.allCourses} remSubSection={this.remSubSection.bind(this)} remSection={this.remSection.bind(this)} remCourse={this.remCourse.bind(this)} cartMode={true}/>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default App;
