$(function() {

// Get server user courses
// For course in courses 
// Add button to navbar with course name
var arrayOfCourseNames = [];
var courseStrArr = "";
var courselistdata = "";
var test = "test";
getCourses(function(response) {
  courseStrArr = response;
  var courselistStringLength = courseStrArr.length;
  courseStrArr=courseStrArr.slice(1, courselistStringLength-1);
  console.log(courseStrArr);
  var Butid = 1;
  while(courseStrArr!=""){
    courseStrArr = courseStrArr.slice(1);
    var nextInvCom = courseStrArr.indexOf("\"");
    var nextCourseName = courseStrArr.slice(0, nextInvCom);
    courselistdata = addCourse(courselistdata, nextCourseName, Butid);
    // $('#'+nextCourseName).on('click', function(e) {
    //   openStudentView(function(response), courseID){
    //     window.location.reload(true);
    //   }
    // });
    courseStrArr=courseStrArr.slice(nextInvCom + 2);
    
    $('#Button'+id).on('click', function(e) {
      sessionStorage.setItem("requestedCourse", nextCourseName);

    });
    Butid++;
  }
  console.log(courselistdata);
  commitCourseList(courselistdata);
});


 

$('#logout-button').on('click', function(e) {
    logout(function(response) {
        if (response == "success") {
          window.location.reload(true); 

        } 

      });

  });


});
//logout button stuff

// function openStudentView(load, courseID) {
//   var data = {
//     "courseID": $('#'+courseID).val()
//   }

//   $.ajax({
//     url: '/openStudentView',
//     type: 'POST',
//     data: JSON.stringify(data),
//     contentType: 'application/json',
//     success: function(res) {
//       load(JSON.parse(res));
//     }
//   });
// }

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

function getCourses(load){
  var data = {
      "userID": "admin",
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


function addStudentname(studentName){
	console.log(studentName);
	$('#studentName').html(studentName);
};

function addCourse(courseList, courseName, id){
	courseList +=
  '<div class="card">'+
   '<h4>'+
      '<a id="' + "Button" + id + '" href="#">' +
		    courseName +

      '</a>'+
    '<h4>'+
  '</div>';
  return courseList;
}

function commitCourseList(courseList){
	$('#courseList').html(courseList);
}



