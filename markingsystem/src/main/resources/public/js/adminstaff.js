
document.addEventListener("DOMContentLoaded", function(event) { 
	$(function() {

        // ====================  ON PAGE LOAD ====================
            //get course IDs from backend 
            getAllCourses(function(response) {
                //loop through list and add to dropdown
                $.each( response, function( k, v ) {
                    //Manage Users Dropdown
                    $("#manUsers_courseDropDown").append( $("<option>")
                        .val(v)
                        .html(v)
                    );
                    //Marks and Structure Dropdown
                    $("#marksStructure_courseDropDown").append( $("<option>")
                        .val(v)
                        .html(v)
                    );
                });             
            });

        // ====================  MANAGE USERS TAB ==================== 
            
            $('#manUsers_courseDropDown').change(function(){
                //update course details and course members
                manUsersSelectCourse(function(course){
                    if(course == 'courseDoesNotExist'){
                        //handle error
                    }
                    else{
                        //LOAD COURSE DETAILS
                        $("#users_courseName").val(course.courseName);
                        $("#users_courseCode").val(course.courseID);
                        $("#users_courseYear").val(course.year);
                        $("#uesrs_coursePeriod").val(course.period);

                        //LOAD COURSE MEMBERS
                        $('#manUsers_membersTable tbody > tr').remove();
                        $.each( course.students, function( i, studentID ) {
                            $("#manUsers_membersTable").find('tbody') 
                            .append($('<tr>')
                                .append($('<td>').text(studentID))
                                .append($('<td>').text('Student'))
                            );
                        });
                    }
                    

                }); 
            });

            //Add a student to a course
            $('#manUsers_addStudent_button').on('click', function(e) {
                manUsersAddStudent(function(response) {
                    //success
                    if (response == "success") {
                        $('#manUsers_addStudent_error').html('<small id="manUsers_addStudent_error" class="form-text text-danger"></small>');
                        getCourseMembers(function(response){

                        //TODO: refresh table

                        });
                        $('#manUser_addStudent')[0].reset();
                    }
                    //error
                    else {
                        $('#manUsers_addStudent_error').html('<small id="manUsers_addStudent_error" class="form-text text-danger">'+response+'</small>');
                    }
                });                
            });

            //Import students to a course
            $('#manUser_studentImport_button').on('click', function(e) {
                
                //TODO: allow admin staff to select file

                manUsersImportStudents(function(response) {
                    //success
                    if (response == "success") {
                        $('#manUsers_importStudent_error').html('<small id="manUsers_importStudent_error" class="form-text text-danger"></small>');
                        getCourseMembers(function(response){

                        //TODO: refresh table

                        });
                        confirm("Successfully imported users!");
                    }
                    //error
                    else {
                        $('#manUsers_importStudent_error').html('<small id="manUsers_importStudent_error" class="form-text text-danger">'+response+'</small>');
                    }
                });                
            });

            //Add staff member to a course
            $('#manUser_staff_button').on('click', function(e) {
                manUsersAddStaff(function(response) {
                    //success
                    if (response == "success") {
                        $('#manUsers_addStaff_IDerror').html('<small id="manUsers_addStaff_IDerror" class="form-text text-danger"></small>');
                        getCourseMembers(function(response){

                        //TODO: refresh table

                        });
                    }
                    //no ID error
                    else if(response == "noID"){
                        $('#manUsers_addStaff_IDerror').html('<small id="manUsers_addStaff_IDerror" class="form-text text-danger">'+'No staff member with this id exsists'+'</small>');
                    }
                });                
            });
        
        // ====================  MARKS AND STRUCTURE TAB ==================== 
            //course change on marks&structure tab
            $('select[name="marksStructure_courseDropDown"]').change(function(){
                //update course details and course members
                marksStructureSelectCourse(function(response){

                    //TODO update course details, marks and course structure based on response
                    
                }); 
            });


        // ====================  STUDENT SEARCH TAB ==================== 
            //Search for a student
            $('#studentSearch_button').on('click', function(e) {
                searchStudent(function(response) {
                    if (response == "noStudents") {
                         $('#searchStudents_table').html('<table class="table table-sm" id = "searchStudents_table"> <thead> <tr> <th>No Results</th> </tr> </thead> </table>');
                    }
                    else if(response == "success"){

                        //TODO: build table display results

                    }
                });
            });

        
        // ====================  CREATE COURSE TAB ====================

            //Add staff member
            $('#createCourse_staff_button').on('click', function(e) {              

            });

            //Import students
            $('#createCourse_studentImport_button').on('click', function(e) {

            });

            //Add a student
            $('#createCourse_addStudent_button').on('click', function(e) {

            });

            //Create course
            $('#createCourse_button').on('click', function(e) {

                //TODO: 
                //update database
                //reset form

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



// ====================  MANAGE USERS TAB ==================== 
    function manUsersSelectCourse(load){
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

    //Add a student to a course
    function manUsersAddStudent(load){
        var data = {
        "studentID": $('#manUser_studentID').val(),
        "courseID": $('#manUsers_courseDropDown').val(),
    }

        $.ajax({
        url: '/adminstaff_manUsers_addStudent',
        type: 'POST',
            data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(res) {
        load(JSON.parse(res));
        }
    });	
    }

    //Add staff member to a course
    function manUsersAddStaff(load){
        var data = {
        "staffID": $('#manUser_staffID').val(),
        "staffRole": $('#manUser_staffRole').val(),
        "courseID": $('#manUsers_courseDropDown').val(),
        }

        $.ajax({
        url: '/adminstaff_manUsers_addStaff',
        type: 'POST',
            data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(res) {
        load(JSON.parse(res));
        }
        });	
    }

    //Import students to a course
    function manUsersImportStudents(load){

        //TODO: send data ta backend 

    }

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

// ====================  STUDENT SEARCH TAB ==================== 

    function searchStudent(load){
        var data = {
        "userID": $('#student_searchBox').val(),
    }
        $.ajax({
        url: '/adminstaff_searchStudent',
        type: 'POST',
            data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(res) {
        load(JSON.parse(res));
        }
    });	

    }


// ====================  CREATE COURSE TAB ====================
    //TODO: write functions

    //add staff member
    function createCourseAddStaff(load){}

    //import student
    function createCourseImportStudent(load){}

    //add student
    function createCourseAddStudent(load){}

    //create course
    function createCourseButton(load){}


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

function getCourseMembers(load){}
function getCourseDetails(load){}

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