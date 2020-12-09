import React from 'react';
import './App.css';
import Course from './Course';

class CourseArea extends React.Component {
  getCourses() {
    let courses = [];

    for(const course of Object.values(this.props.data)) {
      if(!this.props.cartMode){
        // search
        courses.push (
          <Course key={course.name} data={course} courseCallback={this.props.addCourse} subSectionCallbackPass2={this.props.addSubSection} sectionCallbackPass={this.props.addSection} cartMode={this.props.cartMode}/>
        )
      }else{
        // cart
        courses.push (
          <Course key={course.name} data={course} courseCallback={this.props.remCourse} subSectionCallbackPass2={this.props.remSubSection} sectionCallbackPass={this.props.remSection} cartMode={this.props.cartMode}/>
        )
      }
    }

    return courses;
  }

  render() {
    if (this.props.cartMode){
      return (
        <div style={{margin: '15px'}}>
          <h2 style={{display: this.props.data.length ? "none":"block"}}> No courses/sections/subsections added yet. <br></br> Go to "Seach" to add them!</h2>
          {this.getCourses()}
        </div>
      )
      
    }else{
      return (
        <div style={{margin: '15px'}}>
          <h2 style={{display: this.props.data.length ? "none":"block"}}> No courses meet the search criteria. <br></br> Modify the criteria to find courses!</h2>
          {this.getCourses()}
        </div>
      )
    }
  }
}

export default CourseArea;
