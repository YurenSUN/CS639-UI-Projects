import React from 'react';
import './App.css';
import Course from './Course';

class CourseArea extends React.Component {
  getCourses() {
    let courses = [];

    for (const course of Object.values(this.props.data)) {
      if (!this.props.cartMode) {
        // search
        courses.push(
          <Course key={course.name} data={course} courseCallback={this.props.addCourse} subSectionCallbackPass2={this.props.addSubSection} sectionCallbackPass={this.props.addSection} cartMode={this.props.cartMode} compleCourses={this.props.compleCourses} />
        )
      } else {
        // cart
        courses.push(
          <Course key={course.name} data={course} courseCallback={this.props.remCourse} subSectionCallbackPass2={this.props.remSubSection} sectionCallbackPass={this.props.remSection} cartMode={this.props.cartMode} wishCourses={this.props.wishCourses} wishCallback={this.props.wishCourse} compleCourses={this.props.compleCourses} prereqs={this.props.prereqs} />
        )
      }
    }

    return courses;
  }

  resetBg() {
    document.getElementById("cartBg").style.background = "#f9f9f9";
  }

  componentDidUpdate(prevProps) {
    // change back to the original color after 3 seconds
    this.interval = setInterval(() => this.resetBg(), 3000);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    if (this.props.cartMode) {
      return (
        <div class="h-100">
          <h3><strong>Course Cart</strong></h3>
          <h3 style={{ display: this.props.data.length ? "none" : "block" }}> No courses/sections/subsections added yet. <br></br> Go to "Seach" to add them!</h3>
          {this.getCourses()}
        </div>
      )

    } else {
      return (
        <div>
          <h3><strong>Course List</strong></h3>
          <h3 style={{ display: this.props.data.length ? "none" : "block" }}> No courses meet the search criteria. <br></br> Modify the criteria to find courses!</h3>
          {this.getCourses()}
        </div>
      )
    }
  }
}

export default CourseArea;
