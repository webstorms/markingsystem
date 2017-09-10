$(function() {

// Get server user courses
// For course in courses 
// Add button to navbar with course name

$('#logout-button').on('click', function(e) {
    logout(function(response) {
        if (response == "success") {
          window.location.reload(true); 

        } 

      });

  });

//hardcoded bit
var buttons = '';
buttons = addCourseButton("CSC3012F", buttons);		 
commitButtons(buttons);

var collapseData = '';
	collapseData = addlevel(collapseData, "Tests", 80, "1");
		collapseData = addEndLevel(collapseData, "Test 1", 70, "1-1");
		collapseData = addlevel(collapseData, "Test 2", 90, "1-2");
			collapseData = addEndLevel(collapseData, "Section A", 92, "1-2-1");
			collapseData = addEndLevel(collapseData, "Section B", 88, "1-2-2");

		collapseData = endlevel(collapseData);
	collapseData = endlevel(collapseData);
	collapseData = addlevel(collapseData, "Assignments", 40, "2");

		collapseData = addEndLevel(collapseData, "Assignment 1", 40, "2-1");
		collapseData = addEndLevel(collapseData, "Assignment 2", 40, "2-2");


	collapseData = endlevel(collapseData);

commitTable(collapseData); 



});
//buttons
function addCourseButton(buttonTitle, buttons){
	buttons +='<button id="but" class="btn navbar-btn">' + buttonTitle + '</button>';
	console.log(buttons);
	return buttons;
};

function commitButtons(buttons){
	$('#buttons').html(buttons);
};

//collapse groups


function addlevel(collapseData, turpleName,mark, levelnumber){

	collapseData += 
	'<div class="panel-group" >' +
	    '<div class="panel panel-default">'+
	      '<div class="panel-heading">'+
	        '<h4 class="panel-title">'+
	          '<a data-toggle="collapse" href="#collapse'+levelnumber+'">'+ turpleName + '</a>'+
	          '<div class="pull-right"> ' + mark + '</div>' +
	        '</h4>'+
	      '</div>'+
	      '<div id="collapse' + levelnumber + '" class="panel-collapse collapse">' +
	      	'<div class="panel-body">';

      return collapseData;
};


//add an ending level - dropdown does do/show anything
function addEndLevel(collapseData, turpleName,mark, levelnumber){
	collapseData += 
	'<div class="panel-group" >' +
	    '<div class="panel panel-default">'+
	      '<div class="panel-heading">'+
	        '<h4 class="panel-title">'+
	          '<a data-toggle="collapse" href="#collapse'+levelnumber+'">'+ turpleName + '</a>'+
	          '<div class="pull-right"> ' + mark + '</div>' +
	        '</h4>'+
	      '</div>'+
		'</div>' +
	'</div>';
	return collapseData;
}

//add necissary divs to end the file, to close a panel (other than after addEndLevel)
function endlevel(data){
	data += '</div>' +
	'</div>' +
	'</div>' +
	'</div>';
	
  return data;

};

//inserts collapseData into the html
function commitTable(collapseData){
	$('#mark-table').html(collapseData);
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

}