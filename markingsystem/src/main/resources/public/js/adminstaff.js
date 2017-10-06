
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
                    $("#marksStrucutre_courseDropDown").append( $("<option>").val(v).html(v));
                });             
            });

        // ====================  MANAGE USERS TAB ==================== 
            
            //update course details and course members
            $('#manUsers_courseDropDown').change(function() {
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

            //Remove a user
            $('#manUsers_removeUser_button').on('click', function(e) {   
                var userID = $("#manUsers_removeID").val();
                var course = $('#manUsers_courseDropDown').val();

                manUsersRemoveUser(userID,course,function(response) {
                    alert(response);
                    if (response == "success") {
                        manUsersRefreshCourse();
                    }
                    else {
                        
                    }
                });
            });

            
        // ====================  MARKS AND STRUCTURE TAB ==================== 
            //course change on marks&structure tab
            $('#marksStrucutre_courseDropDown').change(function(){                
                marksRefreshCourse();
                
                //marksStructureSelectCourse(function(response){}); 
            });





        // ====================  STUDENT SEARCH TAB ==================== 
            //Search for a student
            $('#studentSearch_button').on('click', function(e) {
                searchStudent(function(response) {
                    if (response == "userNotFound") {
                        $('#searchStudents_table tbody > tr').remove();
                    }
                    else if(response == "success"){
                        //put entry in table
                        var studentID = $('#student_searchBox').val();
                        $('#searchStudents_table tbody > tr').remove();
                        $("#searchStudents_table").find('tbody').append($('<tr>').append($('<td>').html('<a onclick="loadStudentPage(\''+studentID+'\')">'+studentID+'</a>')));
                    }
                });
            });

            
        // ====================  CREATE COURSE TAB ====================

            //Add staff member
            $('#createCourse_staff_button').on('click', function(e) {     
                var userID = $("#createCourse_staffID").val();
                var role = $("#createCourse_staffRole").val();     

                createCourseAddUser(userID,role,function(response) {
                    if(response=="success"){
                        $("#createCourse_membersTable").find('tbody')
                        .append($('<tr>').append($('<td>').text(userID)).append($('<td>').text(role)));
                    }
                    else{
                        alert(response);
                    }
                })
            });

            //Add a student
            $('#createCourse_addStudent_button').on('click', function(e) {   
                var userID = $("#createCourse_studentID").val();
                var role = "student"; 

                createCourseAddUser(userID,role,function(response) {
                    if(response=="success"){
                        $("#createCourse_membersTable").find('tbody')
                        .append($('<tr>').append($('<td>').text(userID)).append($('<td>').text(role)));
                    }
                    else{
                        alert(response);
                    }
                })
            });
            
            //Remove a user
            $('#createCourse_removeStudent_button').on('click', function(e) {   
                var userID = $("#createCourse_removeID").val();

                createCourseRemoveUser(userID,function(response) {
                    if(response=="user"){
                       alert(response);
                    }
                    else{
                        deleteRow(response);
                    }
                })
            });

            //Import students
            $('#createCourse_studentImport_button').on('click', function(e) {
            });

            
            //Create course
            $('#createCourse_button').on('click', function(e) {
                var jsonObj = {};
                var courseArrr = addedCourses_CreateCourseStructure.slice(); //save old data in case error is returned, then data will not be lost
                var structureData = createCourseGetStructure(addedCourses_CreateCourseStructure, jsonObj);
                if (structureData==false){//if values are incorrect
                    addedCourses_CreateCourseStructure =courseArrr.slice();
                    return;  
                }
                else{
                    jsonObj["structure"]=structureData;
                    console.log(jsonObj);

                    createCourse(structureData,function(response) {
                        alert(response);
                        if(response=="success"){
                            
                        }
                        else{
                            
                        }
                    })
                }
            });

            //Create Course Structure
            var upperLevelCounter = 0; //tracks upper level index
            var addedCourses_CreateCourseStructure=[]; //tracks which courses have been added - this is used to get course IDs when getting data entered by the user
            $('#addUpperLevel_CreateStructure').on('click', function(e){
                upperLevelCounter++;
                upperLevelID= upperLevelCounter + "upper" ; //create an ID for the levl index
                addedCourses_CreateCourseStructure.push(upperLevelID);
                $('#courseStructure_CreateStructure').append(       
                    '<div class="card" id="upperLevelID_'+ upperLevelID +'">'+
                        '<div class="card-header" role="tab">'+
                            '<h4>'+
                            '<div class="row">'+
                                '<div class="col-lg-4">'+
                                  '<div class="form-group">'+
                                    '<label for=sectionTitle_"' + upperLevelID + '_CreateCourseStructure>Assesment Type</label>'+
                                    '<input type="text" class="form-control" id="sectionTitle_' + upperLevelID + '_CreateCourseStructure" placeholder="Enter the Assesment type">' +
                                  '</div>'+
                                '</div>'+
                                '<div class="col-lg-4">'+
                                    '<div class="form-group">'+
                                        '<label for=DPReq_"' + upperLevelID + '_CreateCourseStructure>DP Requirement</label>'+
                                        '<input type="text" class="form-control" id="DPreq_' + upperLevelID + '_CreateCourseStructure" placeholder="Enter the DP Requirement">' +
                                    '</div>'+
                                '</div>'+
                                '<div class="col-lg-4">'+
                                  '<div class="form-group">'+
                                    '<label for=weighting_"' + upperLevelID + '_CreateCourseStructure>Weighting</label>'+
                                    '<input type="text" class="form-control" id="weighting_' + upperLevelID + '_CreateCourseStructure" placeholder="Enter the weighting (%)">' +
                                  '</div>'+
                                '</div>'+
                            '</div>'+
                            '<h4>'+

                            '<button class="btn btn-primary" id="addLowerLayer_'+upperLevelID+'_CreateStructure" style="margin:5px;">Add Assesment</button>'+
                            '<button class="btn btn-danger" id="removeCurrentLayer_'+upperLevelID+'_CreateStructure" style="margin:5px;">Remove Assesment Type</button>'+
                            '<button class="btn btn-info" id="ExpandCollapse_'+upperLevelID+'_CreateStructure" type="button" data-toggle="collapse" data-target="#midLevel' + upperLevelID + '" aria-expanded="true" aria-controls="midLevel' + upperLevelCounter + '">'+
                                 'Expand/Collapse'+
                            '</button>'+


                      '</div>'+
                        '<div class="collapse show" id="midLevel' + upperLevelID+ '" style="margin-left:15px;">' +

                        '</div>'+
                    '</div>'

                );


                //remove current section
                $('#removeCurrentLayer_'+upperLevelID+'_CreateStructure').on('click', function(e){
                    var item = $(this).attr('id').slice($(this).attr('id').indexOf("_")+1, $(this).attr('id').lastIndexOf("_")); //used to get the classes ID - upperlevel default to the most recent level created

                    item1='#upperLevelID_' + item; //recreates ID for the selected item to delete

                    $(item1).remove();

                    addedCourses_CreateCourseStructure.splice(addedCourses_CreateCourseStructure.indexOf(item), 1); // removes item from the array
                    var ArrLength = addedCourses_CreateCourseStructure.length;
                    for(var i=0; i<ArrLength; i++){         //looks for any sub sections that need to also be removed

                        console.log("looking for " + item);
                        if (addedCourses_CreateCourseStructure[i].indexOf(item)!=-1){
                            addedCourses_CreateCourseStructure.splice(i, 1);
                            i--;
                            ArrLength--;
                        }

                    }


                });
                

                //midlevel
                var midLevelCounter=0;
                $('#addLowerLayer_'+upperLevelID+'_CreateStructure').on('click', function(e){
                    midLevelCounter++;
                    var item = $(this).attr('id').slice($(this).attr('id').indexOf("_")+1, $(this).attr('id').lastIndexOf("_"));
                    var midLevelID=item+"-"+midLevelCounter+"mid";
                    addedCourses_CreateCourseStructure.push(midLevelID);

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
                                    // '<div class="col-lg-4">'+
                                    //   '<div class="form-group">'+
                                    //      '<label for=maxMark_"' + midLevelID + '_CreateCourseStructure>Maximum Mark</label>'+
                                    //          '<input type="text" class="form-control" id="maxMark_' + midLevelID + '_CreateCourseStructure" placeholder="Enter Maximum Mark">' +
                                    //   '</div>'+
                                    // '</div>'+
                                        '<div class="col-lg-4">'+
                                           '<div class="form-group">'+
                                                '<label for=weighting_"' + midLevelID + '_CreateCourseStructure>Weighting</label>'+
                                                '<input type="text" class="form-control" id="weighting_' + midLevelID + '_CreateCourseStructure" placeholder="Enter the weighting (%)">' +
                                           '</div>'+
                                        '</div>'+
                                   '</div>'+
                                '<h4>'+


                                '<button class="btn btn-primary" id="addLowerLayer_'+midLevelID+'_CreateStructure" style="margin:5px;">Add Sub Section</button>'+
                                '<button class="btn btn-danger" id="removeCurrentLayer_'+midLevelID+'_CreateStructure" style="margin:5px;">Remove Assesment</button>'+
                                '<button class="btn btn-info" id="ExpandCollapse_'+midLevelID+'_CreateStructure" type="button" data-toggle="collapse" data-target="#bottomLevel' + midLevelID + '" aria-expanded="true" aria-controls="collapseExample">'+
                                     'Expand/Collapse'+
                                '</button>'+
                                '</div>'+


                            '<div class="collapse show" id="bottomLevel' + midLevelID+ '" style="margin-left:15px;">' +
                                
                            '</div>'+
                        '</div>'


                    );
                    //remove bottom level
                    $('#removeCurrentLayer_' + midLevelID + '_CreateStructure').on('click', function(e){
                        var item = $(this).attr('id').slice($(this).attr('id').indexOf("_")+1, $(this).attr('id').lastIndexOf("_")); //used to get the classes ID - upperlevel default to the most recent level created

                        item1='#midLevelID_' + item;
                        $(item1).remove();
 
                        var ArrLength = addedCourses_CreateCourseStructure.length;
                        for(var i=0; i<ArrLength; i++){

                            if (addedCourses_CreateCourseStructure[i].indexOf(item)!=-1){
                                addedCourses_CreateCourseStructure.splice(i, 1);
                                i--;
                                ArrLength--;
                            }
                            ;

                        }


                    });

                    //bottomlevel
                    var bottomLevelCounter=0;


                    $('#addLowerLayer_'+midLevelID+'_CreateStructure').on('click', function(e){
                        bottomLevelCounter++;
                        var item = $(this).attr('id').slice($(this).attr('id').indexOf("_")+1, $(this).attr('id').lastIndexOf("_"));
                        var bottomLevelID=item+"-"+bottomLevelCounter+"lower";
                        addedCourses_CreateCourseStructure.push(bottomLevelID);
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
                            '<div class="collapse show" id="bottomLevel' + bottomLevelID+ '" style="margin-left:15px;">' +
                                
                            '</div>'

                        );


                        //remove
                        $('#removeCurrentLayer_'+bottomLevelID+'_CreateStructure').on('click', function(e){
                            var item = $(this).attr('id').slice($(this).attr('id').indexOf("_")+1, $(this).attr('id').lastIndexOf("_")); //used to get the classes ID - upperlevel default to the most recent level created
                            var item1='#bottomLevelID_' + item;
                            $(item1).remove();
                            addedCourses_CreateCourseStructure.splice(addedCourses_CreateCourseStructure.indexOf(item), 1);

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

            $('#password-button').on('click', function(e) {
                window.location.href = '/getPasswordChangeView';

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

    function manUsersRemoveUser(userID,courseID,load){
        var data = {
            "userID": userID,
            "courseID": courseID,
        }
        $.ajax({
            url: '/removeUser',
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

    //refresh course details and members
    function marksRefreshCourse(){
        marksGetCourse(function(course){ //send a post request to get course object
            if(course == 'courseDoesNotExist'){
                //handle error
            }
            else{
                //load course details
                $("#search_courseName").val(course.courseName);
                $("#search_courseCode").val(course.courseID);
                $("#search_courseYear").val(course.year);
                $("#search_coursePeriod").val(course.period);

            }
        });    
    }

    function marksGetCourse(load){
        var data = {
            "courseID": $('#marksStrucutre_courseDropDown').val(),
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
    function loadStudentPage(studentID) {
        sessionStorage.setItem("requestedUser", studentID);
        window.location.href = '/getStudentHomeView';

    }   

// ====================  CREATE COURSE TAB ====================
    //TODO: write functions

    //add user
    function createCourseAddUser(userID,role,load) {
        
        var data = {
            "table": tableToString(),
            "userID": userID,
            "role": role,
        }

        $.ajax({
        url: '/adminstaff_createCourseAddUser',
        type: 'POST',
            data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(res) {
        load(JSON.parse(res));
        }
        
        });

    }

    //remove user
    function createCourseRemoveUser(userID,load){
        
        var data = {
            "table": tableToString(),
            "userID": userID,
        }

        $.ajax({
        url: '/createCourse_removeUserFromCourse',
        type: 'POST',
            data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(res) {
        load(JSON.parse(res));
        }
        
        });

    }

    //import student
    function createCourseImportStudent(load){}

    //create course
    function createCourse(structureData,load){
        var data = {
            "membersTable": tableToString(),
            "courseName": $('#createCourse_name').val(),
            "courseCode": $('#createCourse_code').val(),
            "courseYear": $('#createCourse_year').val(),
            "coursePeriod": $('#createCourse_period').val(),
            "courseStructure": structureData,
        }

        console.log(data);
        $.ajax({
        url: '/createCourse',
        type: 'POST',
            data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(res) {
        load(JSON.parse(res));
        }
        
        });
    }

    //delete row
    function deleteRow(index){
        document.getElementById("createCourse_membersTable").deleteRow(index);
    }

    //create string from table
    function tableToString(){
         var tableString = "{";

        var table = document.getElementById("createCourse_membersTable");
        for (var i = 0, row; row = table.rows[i]; i++) {
            var rowString = "{";

            for (var j = 0, col; col = row.cells[j]; j++) {
                rowString += col.innerHTML+",";
            }

            rowString = rowString.substring(0, rowString.length - 1);
            rowString += "}";
            tableString += rowString +"#";
        }

        tableString = tableString.substring(0, tableString.length - 1);
        tableString += "}";
        return tableString;
    }

    //get structure
    function createCourseGetStructure(courseArr, jsonObj){
        //TODO add cases that force there to be all three levels.
        var data = $('#courseStructure_CreateStructure').html();
        var courseArray= courseArr; //used so that the data is not lost when an error is rerurned
        courseArray = courseArray.sort(); 
        courseArray = courseArray.reverse(); //makes it easier to control array with pop()

        console.log(courseArray);
        var structure = {       // create base structure
            percentage: 0,
            
        };                  
        structure["topLevels"]=[];
        var topCounter=-1;
        var midCounter=0;
        var bottomCounter=0;
        var topDP=0;
        var topWeight = 0;
        var midWeight = 0;
        while(courseArray.length!=0){ //loop through array of levelIDs
            var currentItem = courseArray.pop();

            var numberOfDashes = currentItem.split("-").length - 1; //IDs are split by dashes, this counts the level

            
            if (numberOfDashes==0){     //top level
                if (midCounter==-1){    //checks if there is a midlevel for the toplevel
                    $('#wrong-course-structure').html('<div class="alert alert-danger"role="alert"><p class="text-center">' +  'Assignments Types must have sub sections' + '</p></div>');
                    return false;
                }
                midCounter=-1;
                topCounter ++;
                topWeight = topWeight + Number($('#weighting_' + currentItem + '_CreateCourseStructure').val());    //totals topWeight

                if(midWeight!=0&&midWeight!=100){ //checks the previous midweight total - calling a new top level signifies the end of the current mid level
                    $('#wrong-course-structure').html('<div class="alert alert-danger"role="alert"><p class="text-center">' +  'The weighting of a middle layers do not add up to 100' + '</p></div>');
                    return false;
                }
                midWeight=0;
                if ($('#sectionTitle_' + currentItem + '_CreateCourseStructure').val()==""||Number($('#weighting_' + currentItem + '_CreateCourseStructure').val())==0){ //checks for null values
                    $('#wrong-course-structure').html('<div class="alert alert-danger"role="alert"><p class="text-center">' +  'Enter information into all of the feilds (numerical values cannot be set to 0)' + '</p></div>');
                    return false;

                }
                structure.topLevels.push({name: $('#sectionTitle_' + currentItem + '_CreateCourseStructure').val(), weight: Number($('#weighting_' + currentItem + '_CreateCourseStructure').val()), percentage: 0, dp: Number($('#DPreq_' + currentItem + '_CreateCourseStructure').val()), midLevels: []});
                
            }
            
            if (numberOfDashes==1){
                if (bottomCounter==-1){ //checks if there is a midlevel bottom layer for the midlayer
                    $('#wrong-course-structure').html('<div class="alert alert-danger"role="alert"><p class="text-center">' +  'Assignments must have sub sections' + '</p></div>');
                    return false;
                }
                bottomCounter=-1;
                midCounter++;
                midWeight= midWeight + Number($('#weighting_' + currentItem + '_CreateCourseStructure').val());

                if ($('#assesmentTitle_' + currentItem + '_CreateCourseStructure').val()==""||Number($('#weighting_' + currentItem + '_CreateCourseStructure').val())==0){
                    $('#wrong-course-structure').html('<div class="alert alert-danger"role="alert"><p class="text-center">' +  'Enter information into all of the feilds (numerical values cannot be set to 0)' + '</p></div>');
                    return false;
                }
                structure.topLevels[topCounter].midLevels.push({name: $('#assesmentTitle_' + currentItem + '_CreateCourseStructure').val(), weight: Number($('#weighting_' + currentItem + '_CreateCourseStructure').val()), percentage: 0, bottomLevels: []});
            }

            if (numberOfDashes==2){
                bottomCounter ++;
                structure.topLevels[topCounter].midLevels[bottomCounter].bottomLevels.push({name: $('#sectionTitle_' + currentItem + '_CreateCourseStructure').val(), weight: Number($('#weighting_' + currentItem + '_CreateCourseStructure').val()), percentage: 0});
                if ($('#sectionTitle_' + currentItem + '_CreateCourseStructure').val()==null||Number($('#weighting_' + currentItem + '_CreateCourseStructure').val())==null||Number($('#DPreq_' + currentItem + '_CreateCourseStructure').val())==null){
                    $('#wrong-course-structure').html('<div class="alert alert-danger"role="alert"><p class="text-center">' +  'Enter information into all of the feilds' + '</p></div>');

                    return false;
                }
            }
        }
        if(topWeight!=100){
            $('#wrong-course-structure').html('<div class="alert alert-danger"role="alert"><p class="text-center">' +  'The weighting of the upper layers do not add up to 100' + '</p></div>');
            return false;
        }

        if(midWeight!=100){ //check one more time for the final level - only check each time a new top is called - no new top layer for the final sections
            $('#wrong-course-structure').html('<div class="alert alert-danger"role="alert"><p class="text-center">' +  'The weighting of a middle layers do not add up to 100' + '</p></div>');
            return false;
        }

        //reset html
        $('#courseStructure_CreateStructure').html("");
        $('#wrong-course-structure').html("");
        return structure;
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

