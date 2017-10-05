
document.addEventListener("DOMContentLoaded", function(event) { 
	$(function() {

        // ====================  ON PAGE LOAD ====================
            //get course IDs from backend 
            getAllCourses(function(response) {
                //loop through list and add to dropdown
                $.each( response, function( k, v ) {
                    //Manage Users Dropdown
                    $("#manUsers_courseDropDown").append( $("<option>").val(v).html(v));

                });             
            });

        // ====================  MARKS AND STRUCTURE TAB ====================
            
            //update course details and course members
            $('#manUsers_courseDropDown').change(function(){
                manUsersRefreshCourse();
            });
            

        // ====================  STUDENT SEARCH TAB ==================== 
            //Search for a student
            $('#studentSearch_button').on('click', function(e) {
                searchStudent(function(response) {

                    if (response == "userNotFound") {
                        alert("No users found");
                        $('#searchStudents_table tbody > tr').remove();
                    }
                    else if(response == "success"){
                        //put entry in table
                        var studentID = $('#student_searchBox').val();
                        $('#searchStudents_table tbody > tr').remove();
                        $("#searchStudents_table").find('tbody').append($('<tr>').append($('<td>').html('<a onclick="loadStudentPage(\''+studentID+'\')" href="">'+studentID+'</a>')));
                    }
                });
            });


        // ====================  GENERIC FUNCTIONS ====================
            //logout
            $('#logout').on('click', function(e) {
                logout(function(response) {
                    if (response == "success") {
                    window.location.reload(true); 
                    } 
                });
            });
	


    });
});




// ====================  MARKS AND STRUCTURE TAB ====================
    function marksStructureSelectCourse(load){
        var data = {
        "courseID": $('#marksStrucutre_courseDropDown').val(),
    }
        $.ajax({
        url: '/adminstaff_marksStrucutre_selectCourse',
        type: 'POST',
            data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(res) {
        load(JSON.parse(res));
        }
    });	

    }

    //refresh course details and members
    function manUsersRefreshCourse(){
        manUsersGetCourse(function(course){ //send a post request to get course object
            if(course == 'courseDoesNotExist'){
                //handle error
            }
            else{
                //load course details
                $("#users_courseName").val(course.courseName);
                $("#users_courseCode").val(course.courseID);
                $("#users_courseYear").val(course.year);
                $("#uesrs_coursePeriod").val(course.period);

                //load course members to table
                $('#manUsers_membersTable tbody > tr').remove();
                    //Course Convener:
                    $("#manUsers_membersTable").find('tbody') 
                    .append($('<tr>')
                        .append($('<td>').text(course.courseConvenor))
                        .append($('<td>').text('Course Convenor'))
                    );
                    //Lecturers:
                    $.each( course.lecturers, function( i, lecturerID ) {
                        $("#manUsers_membersTable").find('tbody') 
                        .append($('<tr>')
                            .append($('<td>').text(lecturerID))
                            .append($('<td>').text('Lecturer'))
                        );
                    });
                    //TA:
                     $.each( course.TAs, function( i, taID ) {
                        $("#manUsers_membersTable").find('tbody') 
                        .append($('<tr>')
                            .append($('<td>').text(taID))
                            .append($('<td>').text('TA'))
                        );
                    });
                    //Students:
                    $.each( course.students, function( i, studentID ) {
                        $("#manUsers_membersTable").find('tbody') 
                        .append($('<tr>')
                            .append($('<td>').html('<a onclick="loadStudentPage(\''+studentID+'\')" href="">'+studentID+'</a>'))
                            .append($('<td>').text('Student'))
                        );
                    });  
                 
            }
        });    
    }

    function manUsersGetCourse(load){
        var data = {
            "courseID": $('#manUsers_courseDropDown').val(),
        }
        $.ajax({
            url: '/getCourse',
            type: 'POST',
                data: JSON.stringify(data),
            contentType: 'application/json',
            success: function(res) {
            load(JSON.parse(res));
            }
        });	
    }

// ====================  STUDENT SEARCH TAB ==================== 

    function searchStudent(load){
        var data = {
        "userID": $('#student_searchBox').val(),
         }
        $.ajax({
        url: '/findUser',
        type: 'POST',
            data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(res) {
        load(JSON.parse(res));
        }
    });	

    }

    //TODO: Luke
    function loadStudentPage(studentID){
        console.log(studentID);
    }   

// ====================  GENERIC ====================

function getAllCourses(load){
 $.ajax({
    url: '/getAllCourses',
    type: 'POST',
    contentType: 'application/json',
    success: function(res) {
      load(JSON.parse(res));
    }
  });
  
}


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

