
document.addEventListener("DOMContentLoaded", function(event) { 
	$(function() {

        // ====================  ON PAGE LOAD ====================
            //get course IDs from backend 
            getAllCourses(function(response) {
                //loop through list and add to dropdown
                $.each( response, function( k, v ) {
                    //Manage Users Dropdown
                    $("#manUsers_courseDropDown").append( $("<option>").val(v).html(v));

                    //Marks and Structure Dropdown
                    $("#marksStructure_courseDropDown").append( $("<option>").val(v).html(v));
                });             
            });

        // ====================  MANAGE USERS TAB ==================== 
            
            $('#manUsers_courseDropDown').change(function(){  //
                //update course details and course members
                manUsersRefreshCourse();
            });

            //Add a student to a course
            $('#manUsers_addStudent_button').on('click', function(e) {
                var role = "student";
                var studentID = $('#manUser_studentID').val();
                var courseID = $('#manUsers_courseDropDown').val();

                manUsersAddUser(role,studentID,courseID,function(response) {
                    if (response == "success") {
                        manUsersRefreshCourse();
                        $('#manUsers_addStudent_error').html('<small id="manUsers_addStudent_error" class="form-text text-danger"></small>');
                        $('#manUser_addStudent')[0].reset();
                    }
                    else {
                        $('#manUsers_addStudent_error').html('<small id="manUsers_addStudent_error" class="form-text text-danger">'+response+'</small>');
                    }
                });                

            });

            //Add staff member to a course
            $('#manUser_staff_button').on('click', function(e) {
                var role = $('#manUser_staffRole').val();
                var studentID = $('#manUser_staffID').val();
                var courseID = $('#manUsers_courseDropDown').val();

                manUsersAddUser(role,studentID,courseID,function(response) {
                    if (response == "success") {
                        manUsersRefreshCourse();
                        $('#manUsers_addStaff_IDerror').html('<small id="manUsers_addStaff_IDerror" class="form-text text-danger"></small>');
                    }
                    else {
                        $('#manUsers_addStaff_IDerror').html('<small id="manUsers_addStaff_IDerror" class="form-text text-danger">'+response+'</small>');
                    }
                });        

            });

            //Import students to a course
            $('#manUser_studentImport_button').on('click', function(e) {
                manUsersImportStudents(function(response) {
                    //success
                    if (response == "success") {
                        manUsersRefreshCourse();
                        $('#manUsers_importStudent_error').html('<small id="manUsers_importStudent_error" class="form-text text-danger"></small>');
                        confirm("Successfully imported users!");
                    }
                    //error
                    else {
                        $('#manUsers_importStudent_error').html('<small id="manUsers_importStudent_error" class="form-text text-danger">'+response+'</small>');
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
                    if (response == "userNotFound") {
                         $('#searchStudents_table').html('<table class="table table-sm" id = "searchStudents_table"> <thead> <tr> <th>No Results</th> </tr> </thead> </table>');
                    }
                    else if(response == "success"){
                        //put entry in table
                        var studentID = $('#student_searchBox').val();
                        $('#searchStudents_table tbody > tr').remove();
                        $("#searchStudents_table").find('tbody').append($('<tr>').append($('<td>').html('<a onclick="loadStudentPage(\''+studentID+'\')" href="">'+studentID+'</a>')));
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

            //Create Course Structure
            var upperLevelCounter = 0;
            
            $('#addUpperLevel_CreateStructure').on('click', function(e){
            	upperLevelCounter++;
            	console.log(upperLevelCounter);
            	$('#courseStructure_CreateStructure').append(
            		
            		'<div class="card" id="upperLevelID_'+ upperLevelCounter +'">'+
				      '<div class="card-header" role="tab">'+
				        '<h4 class="mb-0">'+
				        	'<div class="row">'+
					            '<div class="col-lg-4">'+
					              '<div class="form-group">'+
					              	'<label for=sectionTitle_"' + upperLevelCounter + '_CreateCourseStructure>Assesment Type</label>'+
					              	'<input type="text" class="form-control" id="sectionTitle_' + upperLevelCounter + '_CreateCourseStructure" placeholder="Enter the Assesment type">' +
					              '</div>'+
					            '</div>'+
					            '<div class="col-lg-4">'+
					              '<div class="form-group">'+
					              	'<label for=DPReq_"' + upperLevelCounter + '_CreateCourseStructure>DP Requirement</label>'+
					              	'<input type="text" class="form-control" id="DPreq_' + upperLevelCounter + '_CreateCourseStructure" placeholder="Enter the DP requirement">' +
					              '</div>'+
					            '</div>'+
					            '<div class="col-lg-4">'+
					              '<div class="form-group">'+
					              	'<label for=weighting_"' + upperLevelCounter + '_CreateCourseStructure>Weighting</label>'+
					              	'<input type="text" class="form-control" id="weighting_' + upperLevelCounter + '_CreateCourseStructure" placeholder="Enter the weighting (%)">' +
					              '</div>'+
					            '</div>'+
					        '</div>'+

			            	'<button class="btn btn-primary" id="addLowerLayer_'+upperLevelCounter+'_CreateStructure" style="margin:5px;">Add Assesment</button>'+
			            	'<button class="btn btn-danger" id="removeCurrentLayer_'+upperLevelCounter+'_CreateStructure" style="margin:5px;">Remove Assesment Type</button>'+
			            	'<button class="btn btn-info" id="ExpandCollapse_'+upperLevelCounter+'_CreateStructure" type="button" data-toggle="collapse" data-target="#midLevel' + upperLevelCounter + '" aria-expanded="true" aria-controls="midLevel' + upperLevelCounter + '">'+
		                         'Expand/Collapse'+
		                    '</button>'+

				        '</h4>'+
				      '</div>'+
				       	'<div class="collapse show" id="midLevel' + upperLevelCounter+ '" style="margin-left:5px;">' +

		                '</div>'

            	);
            	//Upper level Buttons
            	//remove current section
            	$('#removeCurrentLayer_'+upperLevelCounter+'_CreateStructure').on('click', function(e){
            		var item = $(this).attr('id').slice($(this).attr('id').indexOf("_")+1, $(this).attr('id').lastIndexOf("_")); //used to get the classes ID - upperlevel default to the most recent level created
            		console.log(item);
            		item='#upperLevelID_' + item;
            		$(item).remove();
            		console.log(item);
            	});
            	

            	//midlevel
            	var midLevelCounter=0;
            	$('#addLowerLayer_'+upperLevelCounter+'_CreateStructure').on('click', function(e){
            		midLevelCounter++;
            		var item = $(this).attr('id').slice($(this).attr('id').indexOf("_")+1, $(this).attr('id').lastIndexOf("_"));
 					var midLevelID=item+"-"+midLevelCounter;
 					console.log(midLevelID);
 					$("#midLevel"+item).append(
 						'<div class="card" id="midLevelID_'+ midLevelID +'">'+
				      '<div class="card-header" role="tab">'+
				        '<h4 class="mb-0">'+
				        	'<div class="row">'+
					            '<div class="col-lg-4">'+
					              '<div class="form-group">'+
					              	'<label for=testTitle_"' + midLevelID + '_CreateCourseStructure>Assesment Name</label>'+
					              	'<input type="text" class="form-control" id="assesmentTitle_' + midLevelID + '_CreateCourseStructure" placeholder="Enter Assesment Title">' +
					              '</div>'+
					            '</div>'+
					            '<div class="col-lg-4">'+
					              '<div class="form-group">'+
					              	'<label for=maxMark_"' + midLevelID + '_CreateCourseStructure>Maximum Mark</label>'+
				              		'<input type="text" class="form-control" id="maxMark_' + midLevelID + '_CreateCourseStructure" placeholder="Enter Maximum Mark">' +
					              '</div>'+
					            '</div>'+
					            '<div class="col-lg-4">'+
					              '<div class="form-group">'+
					              	'<label for=weighting_"' + midLevelID + '_CreateCourseStructure>Weighting</label>'+
					              	'<input type="text" class="form-control" id="weighting_' + midLevelID + '_CreateCourseStructure" placeholder="Enter the weighting (%)">' +
					              '</div>'+
					            '</div>'+
					        '</div>'+


			            	'<button class="btn btn-primary" id="addLowerLayer_'+midLevelID+'_CreateStructure" style="margin:5px;">Add Sub Section</button>'+
			            	'<button class="btn btn-danger" id="removeCurrentLayer_'+midLevelID+'_CreateStructure" style="margin:5px;">Remove Assesment</button>'+
			            	'<button class="btn btn-info" id="ExpandCollapse_'+midLevelID+'_CreateStructure" type="button" data-toggle="collapse" data-target="#midLevel"' + midLevelID + ' aria-expanded="true" aria-controls="collapseExample">'+
		                         'Expand/Collapse'+
		                    '</button>'+
			            	'</div>'+
				        '</h4>'+
				      '</div>'+
				       	'<div class="collapse show" id="bottomLevel' + midLevelID+ '" style="margin-left:5px;">' +
		                  	
		                '</div>'

 					);
                    //remove bottom level
 					$('#removeCurrentLayer_'+midLevelID+'_CreateStructure').on('click', function(e){
	            		var item = $(this).attr('id').slice($(this).attr('id').indexOf("_")+1, $(this).attr('id').lastIndexOf("_")); //used to get the classes ID - upperlevel default to the most recent level created
	            		console.log(item);
	            		item='#midLevelID_' + item;
	            		$(item).remove();
	            		console.log(item);
            		});

                    //bottomlevel
                    var bottomLevelCounter=0;
                    console.log(midLevelID);
                    $('#addLowerLayer_'+midLevelID+'_CreateStructure').on('click', function(e){
                        bottomLevelCounter++;
                        var item = $(this).attr('id').slice($(this).attr('id').indexOf("_")+1, $(this).attr('id').lastIndexOf("_"));
                        var bottomLevelID=item+"-"+bottomLevelCounter;
                        console.log(bottomLevelID);
                        console.log("hgi");
                        console.log("#bottomLevel"+item);
                        $("#bottomLevel"+item).append(
                            '<div class="card" id="bottomLevelID_'+ bottomLevelID +'">'+
                          '<div class="card-header" role="tab">'+
                            '<h4 class="mb-0">'+
                                '<div class="row">'+
                                    '<div class="col-lg-4">'+
                                      '<div class="form-group">'+
                                        '<label for=testTitle_"' + bottomLevelID + '_CreateCourseStructure>Section Title</label>'+
                                        '<input type="text" class="form-control" id="sectionTitle_' + bottomLevelID + '_CreateCourseStructure" placeholder="Enter Section Title">' +
                                      '</div>'+
                                    '</div>'+
                                    '<div class="col-lg-4">'+
                                      '<div class="form-group">'+
                                        '<label for=maxMark_"' + bottomLevelID + '_CreateCourseStructure>Maximum Mark</label>'+
                                        '<input type="text" class="form-control" id="maxMark_' + bottomLevelID + '_CreateCourseStructure" placeholder="Enter Maximum Mark">' +
                                      '</div>'+
                                    '</div>'+
                                '</div>'+

                                '<button class="btn btn-danger" id="removeCurrentLayer_'+bottomLevelID+'_CreateStructure" style="margin:5px;">Remove Current Section</button>'+

                                '</div>'+
                            '</h4>'+
                          '</div>'+
                            '<div class="collapse show" id="bottomLevel' + bottomLevelID+ '" style="margin-left:5px;">' +
                                
                            '</div>'

                        );


                        //remove
                        $('#removeCurrentLayer_'+bottomLevelID+'_CreateStructure').on('click', function(e){
                            var item = $(this).attr('id').slice($(this).attr('id').indexOf("_")+1, $(this).attr('id').lastIndexOf("_")); //used to get the classes ID - upperlevel default to the most recent level created
                            console.log(item);
                            item='#bottomLevelID_' + item;
                            $(item).remove();
                            console.log(item);
                        });
                    });
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



// ====================  MANAGE USERS TAB ==================== 
    //Add a user to a course
    function manUsersAddUser(role,userID,courseID,load){
        var data = {
            "role": role,
            "userID": userID,
            "courseID": courseID,
        }
          
        $.ajax({
            url: '/addUser', 
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
                            .append($('<td>').text(studentID))
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

