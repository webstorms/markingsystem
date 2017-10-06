var arrayOfCourseNames = [];
var courseStrArr = "";
var courselistdata = "";
var test = "test";

$(function() {

var reqUser = sessionStorage.getItem("requestedUser");
console.log(reqUser);
// Arrived from admin-staff view
if(reqUser != "") {
  // Add student name
  $('#studentName').html('<h1 class="navbar-brand mb-0">' + reqUser + '</h1>');
  // Add back button
  $('#backButton').html('<a class="btn navbar-btn btn-outline-secondary" href="/" >back</a>');

}
else {
  $('#studentName').html('<h1 class="navbar-brand mb-0">Student</h1>');

}

getCourses(reqUser, function(json) {
  courses = [];
  var courselistdata = "";
  for(var i = 0; i < json.length; i++) {
    var nextCourseName = json[i];
    courses.push(nextCourseName);
    getCourse(nextCourseName, function(response) {
      console.log(response);
      var courseName = response.courseName;
      var year = response.year;
      var period = response.period;
      courselistdata = addCourse(courselistdata, courseName, year, period, i + 1);
      
    });

  }

  commitCourseList(courselistdata);

  Butid = 1;
  courses.forEach(function(entry) {
    $('#Button'+Butid).on('click', function(e) {
      sessionStorage.setItem("requestedCourse", entry);
      window.location.href = '/getStudentView';
      
    });
    Butid++;
  });
  
});

$('#logout-button').on('click', function(e) {
    logout(function(response) {
        if (response == "success") {
          window.location.reload(true); 

        } 

      });

  });

$('#password-button').on('click', function(e) {
    window.location.href = '/getPasswordChangeView';

  });

});


function logout(load) {
  $.ajax({
    url: '/logout',
    type: 'POST',
    contentType: 'application/json',
    success: function(res) {
      load(JSON.parse(res));
    }
  });

}

function getCourses(id, load) {
  var data = {
      "userID": id
    }
    $.ajax({
      url: '/getCourses',
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(res) {
        load(JSON.parse(res));
      }
    }); 
}


function addStudentname(studentName) {
	console.log(studentName);
	$('#studentName').html(studentName);
};

function addCourse(courseList, courseName, year, period, id) {
	courseList +=
  '<div class="card">' + 
  '<div class="card-block">' + 
    '<h4 class="card-title">' + courseName + ' (' + period + ') </h4>' + 
    '<h6 class="card-subtitle mb-2 text-muted"> Year: ' + year + '</h6>' +
    '<a id="' + "Button" + id + '" class="btn btn-primary">View</a>' +
  '</div>' + 
'</div>';
  return courseList;
}

function commitCourseList(courseList) {
	$('#courseList').html(courseList);
}

function getStudentView(load) {
  $.ajax({
    url: '/getStudentView',
    type: 'GET',
    contentType: 'application/json'
  });
}

function getCourse(id, load) {
  var data = {
      "courseID": id
    }
    $.ajax({
      url: '/getCourse',
      type: 'POST',
      async: false,
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(res) {
        load(JSON.parse(res));
      }
    }); 

}