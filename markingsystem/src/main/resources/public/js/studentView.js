$(function() {

// Get server user courses
// For course in courses 
// Add button to navbar with course name
var reqCourse = sessionStorage.getItem("requestedCourse");

$('#logout-button').on('click', function(e) {
    logout(function(response) {
        if (response == "success") {
          window.location.href = '/';

        } 

      });

  });

$('#password-button').on('click', function(e) {
    window.location.href = '/getPasswordChangeView';

  });


var maindata = '';
var headdata = '';
getMarks(function(response) {

	var courseName = "";
	var sub = "";
	getCourse(reqCourse, function(_response) {
     	courseName = _response.courseName;
    });

	// console.log(response);

	if(response.complete == false) {
		sub = "Course not complete.";

	}
	else {
		sub = "Final Mark: " + response.percentage;

	}

	headdata = '<div class="card">' + 
  	'<div class="card-block">' + 
    '<h4 class="card-title">' + courseName + '</h4>' + 
    '<h6 class="card-subtitle mb-2 text-muted">' + sub + '</h6>' + 
  	'</div>' + 
	'</div>'

	commitHead(headdata);

	// Loop over top levels
	var count = 0;
	response.topLevels.forEach(function(entry) {
    	console.log(entry)
    	maindata = addlevel1(maindata, entry.name, entry.percentage, count);

    	// Loop over mid levels
    	var _count = 0;
    	entry.midLevels.forEach(function(_entry) {
    		console.log(_entry)
    		maindata = addlevel2(maindata, _entry.name, _entry.percentage, count + "-" + _count, _entry.mark, _entry.maxMark);

    		// Loop over bottom levels
    		var __count = 0;
    		_entry.bottomLevels.forEach(function(__entry) {
    			maindata = addlevel3(maindata, __entry.name, __entry.percentage, count + "-" + _count + "-" + __count, __entry.mark, __entry.maxMark);
    			maindata=endlevel(maindata);
    			__count++;
    		});

    		maindata=endlevel(maindata);
    		_count++;

    	});
    	
    	maindata=endlevel(maindata);
		count++;

  	});
	commitTable(maindata);
});

});

//buttons
function addCourseButton(buttonTitle, buttons, id){
	buttons +='<button id="Button"' + id + ' class="btn navbar-btn btn-secondary">' + buttonTitle + '</button>';
	return buttons;
};

function commitButtons(buttons){
	$('#buttons').html(buttons);
};

//collapse groups
function getStudentMarks(load){
	var data = {
			"userID": "student1", "courseID": "mam100017",
		}
		$.ajax({
			url: '/getStudentMarks',
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			success: function(res) {
				load(JSON.parse(res));
			}
		});	
}

function addlevel1(collapseData, turpleName, percentage, levelnumber) {

	collapseData += 
	'<div class="card">'+
      '<div class="card-header" role="tab">'+
        '<h4 class="mb-0">'+
          '<div class=" panel-title">'+
            '<span class="float-left">'+
              '<a class="collapsed" data-toggle="collapse" href="#collapse'+levelnumber+'" aria-expanded="false">'+
                turpleName+
              '</a>'+
            '</span>'+
            '<span class="panel-title float-right">'+
              percentage+ "%" +
            '</span>'+
          '</div>'+
        '</h4>'+
      '</div>'+
      '<div id="collapse'+levelnumber+'" class="collapse" role="tabpanel">';

      return collapseData;
};


function addlevel2(collapseData, turpleName, percentage, levelnumber, mark, maxMark) {

	collapseData += 
		'<div class="card">'+
	      '<div class="card-header" role="tab">'+
	        '<h5 class="mb-0">'+
	          '<div class=" panel-title">'+
	            '<span class="float-left">'+
	              '<a class="collapsed" data-toggle="collapse" href="#collapse'+levelnumber+'" aria-expanded="false">'+
	                turpleName+
	              '</a>'+
	            '</span>'+
	            '<span class="panel-title float-right">'+
	              percentage+ "%  (" + mark + "/" + maxMark+ ")"+
	            '</span>'+
	          '</div>'+
	        '</h5>'+
	      '</div>'+
    	'<div id="collapse'+levelnumber+'" class="collapse" role="tabpanel">';

	
      return collapseData;
};

function addlevel3(collapseData, turpleName, percentage, levelnumber, mark, maxMark){

	collapseData += 
	'<div class="card">'+
      '<div class="card-header" role="tab">'+
        '<h6 class="mb-0">'+
          '<div class=" panel-title">'+
            '<span class="float-left">'+
              '<a class="collapsed" data-toggle="collapse" href="#collapse'+levelnumber+'" aria-expanded="false" style="text-decoration: none">'+
                turpleName+
              '</a>'+
            '</span>'+
            '<span class="panel-title float-right">'+
              percentage + "%  (" + mark + "/" + maxMark+")"+
            '</span>'+
          '</div>'+
      '</div>'+
      '<div id="collapse'+levelnumber+'" class="collapse" role="tabpanel">';
	
      return collapseData;
};



//add necissary divs to end the file, to close a panel (other than after addEndLevel)
function endlevel(data){
	data +=	'</div>'
	+'</div>';
	
  return data;

};

//inserts collapseData into the html
function commitTable(collapseData){
	$('#mark-table').html(collapseData);
};

function commitHead(headData){
	$('#heading').html(headData);
};


//logout button stuff
function logout(load) {
  $.ajax({
    url: '/logout',
    type: 'POST',
    contentType: 'application/json',
    success: function(res) {
      load(JSON.parse(res));
    }
  });

};

function getMarks(load) {
	var data = {
			"userID": "student1", "courseID": "mam100017",
		}
		$.ajax({
			url: '/getMarks',
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			success: function(res) {
				load(JSON.parse(res));
			}
		});	
}

function getCourses(load) {
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