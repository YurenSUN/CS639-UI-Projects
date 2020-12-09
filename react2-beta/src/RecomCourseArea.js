import React from 'react';
import './App.css';
import RecomCourse from './RecomCourse';

class RecomCourseArea extends React.Component {
  getCourses() {
    let completed = Object.values(this.props.compleCourses)[0];
    let courses = [];
    let interests = [];
    let added = [];
    let wishReq = {};
    // add wish courses and their dependencies first
    var i;
    if (this.props.wishCourses.length) {
      for (const course of this.props.wishCourses) {
        // add to wishlist because there are prereq not fulfilled
        var cur_course = course.split(";")[0];
        var cur_req = course.split(";")[1];
        // add the wished course

        courses.push(
          <RecomCourse key={"recom " + cur_course} data={{ "name": cur_course.split(": ")[1], "number": cur_course.split(": ")[0] }} interests={""} wishList={" is added to the waitlist"} wishCallback={this.props.wishCourse} />
        );
        added.push(
          cur_course.split(":")[0]
        );
        // add the prereqs
        var cur_req_list = cur_req.replaceAll(" AFTER ", ";").replaceAll(") AND (", ";").replaceAll(" OR ", ";").replaceAll("(", "").replaceAll(")", "").split(";")
        for (i = 0; i < cur_req_list.length; i++) {

          if (cur_req_list[i] in wishReq) {
            wishReq[cur_req_list[i]].push(cur_course.split(":")[0])
          } else {
            wishReq[cur_req_list[i]] = [cur_course.split(":")[0]]
          }
        }
      }

      // add wish list prereq
      for (const course of Object.values(this.props.courses)) {
        // ignore added courses
        if (added && added.includes(course.number)) {
          continue;
        }

        if (course.number in wishReq) {
          courses.push(
            <RecomCourse key={"recom " + course.number} data={course} interests={""} wishList={" should be completed before taking the course(s) in your wishlist: " + wishReq[course.number].join(" and ")} />
          );
          added.push(
            course.number
          );
        }
      }
    }

    // generate the list of interests
    if (this.props.interestedCourses.length) {
      // skip added courses from wish list
      for (const course of Object.values(this.props.courses)) {
        // generate the list of interests
        if (this.props.interestedCourses.indexOf(course.number) !== -1)
          for (const keyword of course.keywords)
            if (interests.indexOf(keyword) === -1)
              interests.push(keyword);
      }

      // get courses based on interests
      for (const course of Object.values(this.props.courses)) {
        // courses with interested keyword but not completed
        if (completed && completed.includes(course.number)) {
          continue;
        }
        // skip added courses from wish list
        if (added && added.includes(course.number)) {
          continue;
        }

        var cur_interest = " ";
        for (const keyword of course.keywords)
          if (interests.indexOf(keyword) !== -1)
            cur_interest += keyword + ", "

        // if some keyword is interested
        if (cur_interest !== " ") {
          courses.push(
            <RecomCourse key={"recom " + course.name} data={course} interests={cur_interest.substring(0, cur_interest.length - 2)} wishList={""} />
          )
        }
      }
    }

    return courses;
  }

  render() {
    return (
      <React.Fragment>
        <h3 style={{ display: (this.getCourses()).length ? "none" : "block" }}>
          Give high ratings to the completed courses that you are interested in <br></br>
        or add courses to wishList to find recommendations!</h3>

        <div class="h-100 mt-2 ml-1">
          {this.getCourses()}
        </div>
      </React.Fragment>
    );
  }
}

export default RecomCourseArea;
