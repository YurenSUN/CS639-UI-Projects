class SearchAndFilter {
  searchAndFilter(courses, search, subject, minimumCredits, maximumCredits, interest) {
    var retCourses = []

    for (const index in courses) {
      var cur = courses[index];

      // filter subject
      if (subject && subject !== "All" && cur.subject !== subject) {
        continue;
      }

      // filter credit
      if (minimumCredits && cur.credits < minimumCredits) {
        continue;
      }
      if (maximumCredits && cur.credits > maximumCredits) {
        continue;
      }

      // filter search, search should be a keyword or contained by keyword
      if (search && !cur.keywords.includes(search)) {
        // not match a keyword, test whether keywords contain the input
        var contain = false;
        var i;
        for (i = 0; i < cur.keywords.length; i++) {
          if (cur.keywords[i].includes(search)) {
            contain = true;
          }
        }
        if (!contain) {
          continue;
        }
      }

      // filter interest, interest should be a keyword
      if (interest && interest !== "All" && !cur.keywords.includes(interest)) {
        continue;
      }

      retCourses.push(cur);
    }

    return retCourses;
  }
}

export default SearchAndFilter;
