//================================================================================
//                    Event Listeners and JQuerys 
//================================================================================
document.addEventListener("DOMContentLoaded", function(event) { 
	$(function() {
        // ====================  ON PAGE LOAD ====================
            //get course IDs for TA from backend and populate dropdowns 
            getAllCourses(function(response) {
                $('#marksTab').hide();
                var myStringArray = $.map(response, function(el) { return el });
                var arrayLength = myStringArray.length;
                for (var i = 0; i < arrayLength; i++) {
                    var v = myStringArray[i];
                    $("#marksStrucutre_courseDropDown").append( $("<option>").val(v).html(v));
                }
                //$.each( JSON.parse(response), function( k, v ) { 
                 //   $("#marksStrucutre_courseDropDown").append( $("<option>").val(v).html(v));
                  //  $('#marksTab').hide();
                //});             
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
            "membersTable": tableToString(),
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
    var data = {
        "userID": "",
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