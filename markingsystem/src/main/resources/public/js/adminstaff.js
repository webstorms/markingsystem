//================================================================================
//                    Event Listeners and JQuerys 
//================================================================================
document.addEventListener("DOMContentLoaded", function(event) { 
	$(function() {
        // ====================  ON PAGE LOAD ====================
            //get course IDs from backend and populate dropdowns 
            getAllCourses(function(response) {
                $.each( response, function( k, v ) { 
                    $("#manUsers_courseDropDown").append( $("<option>").val(v).html(v));
                    $('#manUsersDiv').hide();
                    $("#marksStrucutre_courseDropDown").append( $("<option>").val(v).html(v));
                    $('#marksTab').hide();
                });             
            });

        // ====================  MANAGE USERS TAB ==================== 
            
            //update course details on dropdown change
            $('#manUsers_courseDropDown').change(function(){
                if($('#manUsers_courseDropDown').val() =="Select a course"){
                    $('#manUsersDiv').hide();
                }
                else{
                    $('#manUsersDiv').show();
                    manUsersRefreshCourse();
                }
            });

            //Add a student to a course
            $('#manUsers_addStudent_button').on('click', function(e) {
                var role = "student";
                var studentID = $('#manUser_studentID').val();
                var courseID = $('#manUsers_courseDropDown').val();

                manUsersAddUser(role,studentID,courseID,function(response) {
                    if (response == "success") {
                        manUsersRefreshCourse();
                        $('#manUser_addStudent')[0].reset();
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
                    }
                });        

            });

            //Import students to a course
            var fileData;
            var fileInput = document.getElementById("manUsers_file");
            fileInput.addEventListener('change', function () {
                var reader = new FileReader();
                reader.onload = function () { 
                    fileData = reader.result;
                };
                reader.readAsBinaryString(fileInput.files[0]);
            });
            document.getElementById("manUser_studentImport_button").addEventListener("click", function(){
                  manUsersImportStudents(fileData, function(response) {manUsersRefreshCourse();});
                
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
                });
            });

            
        // ====================  MARKS AND STRUCTURE TAB ==================== 
            //update details on dropdown select
            $('#marksStrucutre_courseDropDown').change(function(){    
                if($('#marksStrucutre_courseDropDown').val() =="Select a course"){
                    $('#marksTab').hide();
                }
                else{
                    $('#marksTab').show();
                    marksRefreshCourse();
                    marksGetCourse(function(course){ 
                        $("#marks_textArea").html('');
                        var courseData = course;
                        courseID = courseData.courseID;
                        stud = courseData.students;

                        $("#marks_textArea").append(
                            '<thead>'+
                                '<tr>'+
                                    '<th class="w-20">Student Number </th>'+
                                    '<th class="w-20">Top Level</th>'+
                                    '<th class="w-20">Mid Level</th>'+
                                    '<th class="w-20">Bottom Level</th>'+
                                    '<th class="w-20">Mark</th>'+
                                '</tr>'+
                            '<thead>'+
                            '<tbody id="tableBody">'+
                            '</tbody>'

                        );

                        var firstStud=true;
                        var firstTop=true;
                        var firstMid=true;
                        var printMark;
                        // Iterate over students
                        for (var i=0; i<stud.length; i++){
                            firstStud=true;
                          
                            var studi=stud[i];
                            getMarks(stud[i], function(response){
                                marks = response;
                                toplev = marks.topLevels

                                // Iterate over Top levels
                                for (var k = 0; k<toplev.length; k++){
                                    firstTop=true;
                                    midlev = toplev[k].midLevels;

                                    // Iterate over Mid Levels
                                    for(var j =0; j<midlev.length;j++){
                                        firstMid=true;;
                                        bottomlev = midlev[j].bottomLevels;

                                        // Iterate over Bottom Levels
                                        for (var p=0; p<bottomlev.length; p++) {

                                            if (firstStud==true) {
                                                var studPrint=studi;
                                            }
                                            else{
                                                var studPrint='';
                                            }

                                            if (firstMid==true){
                                                var midPrint = midlev[j].name;
                                            }
                                            else{
                                                var midPrint='';
                                            }

                                            if(firstTop==true){
                                                var topPrint=toplev[k].name;
                                            }
                                            else{
                                                var topPrint='';
                                            }

                                            if (typeof bottomlev[p].mark== "undefined"){
                                                $("#tableBody").append('<tr>'+
                                                    '<th scope="row">'+studPrint+'</th>'+
                                                    '<td>'+ topPrint +'</td>'+
                                                    '<td>' + midPrint +'</td>'+
                                                    '<td>' + bottomlev[p].name + ' (' + bottomlev[p].maxMark + ')</td>'+
                                                    '<td><input type="text" id="' + i+'-'+k+'-'+j+'-'+p + '" style="background-color:#d3d3d3;" value="" >' + '</td>'+
                                                '</tr>'
                                                )
                                            }

                                            else{
                                                $("#tableBody").append('<tr>'+
                                                        '<th scope="row">'+studPrint+'</th>'+
                                                        '<td>'+ topPrint +'</td>'+
                                                        '<td>' + midPrint +'</td>'+
                                                        '<td>' + bottomlev[p].name + ' (' + bottomlev[p].maxMark + ')</td>'+
                                                        '<td><input type="text" id="' + i+'-'+k+'-'+j+'-'+p + '" value="' + bottomlev[p].mark + '">' + '</td>'+
                                                    '</tr>'
                                                )
                                            }
                                            
                                            
                                            firstStud=false;
                                            firstMid=false;
                                            firstTop=false;

                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            });
            
            //send mark changes to backend
            $('#commitMarks').on('click', function(e){
                var breakOut=false;
                marksGetCourse(function(course){
                    var courseData = course;
                    stud = courseData.students;
                    var firstStud=true;
                    var firstTop=true;
                    var firstMid=true;
                    var jsonObj ={"Students":[]}
                    for (var i=0; i<stud.length; i++){
                        firstStud=true;
                        var studi=stud[i];
                        getMarks(stud[i], function(response){
                            marks = response;
                            toplev = marks.topLevels
                            for (var k = 0; k<toplev.length; k++){
                                firstTop=true;
                                midlev = toplev[k].midLevels;

                                for(var j =0; j<midlev.length;j++){
                                    firstMid=true;
                                    bottomlev = midlev[j].bottomLevels;
                                    for (var p=0; p<bottomlev.length; p++){

                                        // It's a gry field
                                        if ($('#'+ i+'-'+k+'-'+j+'-'+p).val() == ""){
                                            //do nothing
                                            marks.topLevels[k].midLevels[j].bottomLevels[p]["mark"] = null;
                                            $(('#'+ i+'-'+k+'-'+j+'-'+p)).attr('style', "background-color:#d3d3d3;");

                                        }

                                        // Is not a number
                                        else if (isNaN($('#'+ i+'-'+k+'-'+j+'-'+p).val())) {
                                            breakOut=true
                                            $(('#'+ i+'-'+k+'-'+j+'-'+p)).attr('style', "background-color:#FF9494;");

                                        }

                                        else if ($('#'+ i+'-'+k+'-'+j+'-'+p).val()<0){
                                            breakOut=true;
                                            $(('#'+ i+'-'+k+'-'+j+'-'+p)).attr('style', "background-color:#FF9494;");
                                        }

                                        else if ($('#'+ i+'-'+k+'-'+j+'-'+p).val()>marks.topLevels[k].midLevels[j].bottomLevels[p]["maxMark"]){
                                            breakOut=true;
                                            $(('#'+ i+'-'+k+'-'+j+'-'+p)).attr('style', "background-color:#FF9494;");
                                        }

                                        else{
                                            marks.topLevels[k].midLevels[j].bottomLevels[p]["mark"] = Number($('#'+ i+'-'+k+'-'+j+'-'+p).val());
                                            $(('#'+ i+'-'+k+'-'+j+'-'+p)).attr('style', "background-color:#FFFFFF;");

                                        }
                                        firstStud=false;
                                        firstMid=false;
                                        firstTop=false;


                                    }

                                }

                            }
                        });
                    jsonObj.Students.push(marks);
                    }

                    if(breakOut==false){
                        $('#wrong-input').html('');
                        updateMarks(courseData.courseID, jsonObj, function(response) {
                            confirm("Marks updated.");
                        });

                    }
                    else{
                        $('#wrong-input').html('<div class="alert alert-danger"role="alert"><p class="text-center">' +  'Marks must be numbers between 0 and max mark.' + '</p></div>');
                    }
                    
                });

            });

        // ====================  STUDENT SEARCH TAB ==================== 
            //Search for a student
            $('#studentSearch_button').on('click', function(e) {
                searchStudent(function(response) {
                    //update table
                    if (response == "userNotFound") {
                        $('#searchStudents_table tbody > tr').remove();
                    }
                    else {
                        $('#searchStudents_table tbody > tr').remove()
                        for(var i = 0; i < response.length; i++) {
                            var obj = response[i];
                            $("#searchStudents_table").find('tbody').append($('<tr>').append($('<td>').html('<a onclick="loadStudentPage(\''+obj+'\')">'+obj+'</a>')));

                        }

                    }
                    // else if(response == "success") {
                    //     var studentID = $('#student_searchBox').val();
                    //     $('#searchStudents_table tbody > tr').remove();
                    //     $("#searchStudents_table").find('tbody').append($('<tr>').append($('<td>').html('<a onclick="loadStudentPage(\''+studentID+'\')">'+studentID+'</a>')));
                    // }

                });
            });
          
        // ====================  CREATE COURSE TAB ====================            
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


//================================================================================
//                    FUNCTIONS and AJAX POSTS 
//================================================================================
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
    function manUsersImportStudents(input, load) {
    var data = {
        "file": csvJSON(input),
        "courseID":$('#manUsers_courseDropDown').val()
    }
        $.ajax({
        url: '/manUsers_importUsers',
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
                            .append($('<td>').html('<a onclick="loadStudentPage(\''+studentID+'\')">'+studentID+'</a>'))
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

    //get course details
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

    //get course marks 
    function getMarks(StudentID, load) {
        var data = {
            "userID": StudentID,
            "courseID": $('#marksStrucutre_courseDropDown').val(),
        }
        $.ajax({
            url: '/getMarks',
            async: false ,
            type: 'POST',
                data: JSON.stringify(data),
            contentType: 'application/json',
            success: function(res) {
            load(JSON.parse(res));
            }
        });
    }

    //change course marks
    function updateMarks(courseID, data, load) {
        $.ajax({
            url: '/updateMarks',
            type: 'POST',
            data: JSON.stringify({"courseID": courseID, "data" : data}),
            contentType: 'application/json',
            success: function(res) {
                load(JSON.parse(res));
            }
        }); 
    }
// ====================  STUDENT SEARCH TAB ==================== 
    //seach for a student:
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

    //relocate to student page:
    function loadStudentPage(studentID) {
        sessionStorage.setItem("requestedUser", studentID);
        window.location.href = '/getStudentHomeView';

    }   

// ====================  CREATE COURSE TAB ====================
    //create course
    function createCourse(structureData,load){
        var data = {
            "membersTable": "",
            "courseName": $('#createCourse_name').val(),
            "courseCode": $('#createCourse_code').val(),
            "courseYear": $('#createCourse_year').val(),
            "coursePeriod": $('#createCourse_period').val(),
            "courseStructure": structureData,
        }

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


    //get structure
    function createCourseGetStructure(courseArr, jsonObj) {
        //TODO add cases that force there to be all three levels.
        var data = $('#courseStructure_CreateStructure').html();
        var courseArray= courseArr; //used so that the data is not lost when an error is rerurned
        courseArray = courseArray.sort(); 
        courseArray = courseArray.reverse(); //makes it easier to control array with pop()

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


    //convert from csv file contents to a json object
    function csvJSON(csv){
    
    var lines=csv.split("\n");
    var result = [];
    var headers=lines[0].split(",");
    
    for(var i=1;i<lines.length;i++){
        var obj = {};
        var currentline=lines[i].split(",");
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    
    }

    return JSON.stringify(result);
    }

//================================================================================
//================================================================================