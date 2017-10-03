
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
					              	'<label for=sectionTitle_"' + upperLevelCounter + '_CreateCourseStructure>Assignment Type</label>'+
					              	'<input type="text" class="form-control" id="sectionTitle_' + upperLevelCounter + '_CreateCourseStructure" placeholder="Enter the Assignment type">' +
					              '</div>'+
					            '</div>'+
					            '<div class="col-lg-4">'+
					              '<div class="form-group">'+
					              	'<label for=DPReq_"' + upperLevelCounter + '_CreateCourseStructure>Assignment</label>'+
					              	'<input type="text" class="form-control" id="DPreq_' + upperLevelCounter + '_CreateCourseStructure" placeholder="Enter the DP requirement">' +
					              '</div>'+
					            '</div>'+
					            '<div class="col-lg-4">'+
					              '<div class="form-group">'+
					              	'<label for=weighting_"' + upperLevelCounter + '_CreateCourseStructure>Weighting</label>'+
					              	'<input type="text" class="form-control" id="weighting_' + upperLevelCounter + '_CreateCourseStructure" placeholder="Enter the weighting (5)">' +
					              '</div>'+
					            '</div>'+
					        '</div>'+

			            	'<button class="btn btn-primary" id="addLowerLayer_'+upperLevelCounter+'_CreateStructure" style="margin:5px;">Add Assignment</button>'+
			            	'<button class="btn btn-danger" id="removeCurrentLayer_'+upperLevelCounter+'_CreateStructure" style="margin:5px;">Remove Assignment Type</button>'+
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
					              	'<label for=testTitle_"' + midLevelID + '_CreateCourseStructure>Assignment Name</label>'+
					              	'<input type="text" class="form-control" id="assignmentTitle_' + midLevelID + '_CreateCourseStructure" placeholder="Enter Assignment Title">' +
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
                                    '<div class="col-lg-4">'+
                                      '<div class="form-group">'+
                                        '<label for=weighting_"' + bottomLevelID + '_CreateCourseStructure>Weighting</label>'+
                                        '<input type="text" class="form-control" id="weighting_' + bottomLevelID + '_CreateCourseStructure" placeholder="Enter the weighting (%)">' +
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