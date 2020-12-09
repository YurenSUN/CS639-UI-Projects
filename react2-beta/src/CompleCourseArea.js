import React from 'react';
import './App.css';
import CompletedCourse from './CompleCourse';

class CompletedCourseArea extends React.Component {
  getCourses() {
    let courses = [];
    let completed = Object.values(this.props.compleCourses)[0];
    if (completed) {
      for (const course of Object.values(this.props.courses)) {
        // add the courses that are in completed course to the list
        if (completed.includes(course.number)) {
          courses.push(
            <CompletedCourse key={"completed " + course.name} data={course} ratingCallback={this.props.rating} />
          )
        }
      }
    }

    return courses;
  }

  render() {
    return (
      <React.Fragment>
        <div class="h-100 mt-2 ml-1">
          <h3 style={{ display: this.getCourses() ? "none" : "block" }}> No courses/sections/subsections added yet. <br></br> Go to "Seach" to add them!</h3>
          {this.getCourses()}
        </div>
      </React.Fragment>
    );
  }
}

export default CompletedCourseArea;
