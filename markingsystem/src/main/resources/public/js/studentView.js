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

var maindata = '';
var headdata = '';
getMarks(function(response){
	console.log(response);
	strData = response;
	strData=strData.slice(9)
	var courseName="mam100017"; ///hardcoded

	headdata = headdata + 
		'<hr><h1>'+courseName+'<h1><hr>';
	strData = strData.slice(strData.indexOf(":"));
	var finalmark = strData.slice(0, strData.indexOf(","));

	console.log(strData.slice(13));
	headdata = headdata +
		'<h4>' + " Final Mark: " + finalmark + '<h4><hr>';  

	commitHead(headdata);

	strData=strData.slice(strData.indexOf(","));

	strData= strData.slice(13);


	var levelCounter = 0;
	var levID ='';
	var counter=0;
	while(strData!=''){



		if (strData.slice(0,2)=="[]"){
			strData=strData.slice(2);
			maindata=endlevel(maindata);
			continue;

		}
		

		else if (strData.slice(1,2)=="]"){

			levelCounter--;
			levID = levID.slice(0,levID.lastIndexOf("-"));
			strData=strData.slice(1);



		}

		else if (strData.slice(0, 1)=="[" || strData.slice(1, 2)=="," || strData.slice(1,2)=="["){

			if (strData.slice(0, 1)=="["){
				levelCounter++;
				levID = levID + "-1";


			}

			if (strData.slice(1,2)=="["){
				levelCounter++;
				levID = levID + "-1";
			}

			else if (strData.slice(1, 2)==","){


				var lastNumber=Number((levID.slice(levID.lastIndexOf("-")+1)));

				lastNumber ++;

				levID= levID.slice(0, levID.lastIndexOf("-")+1);
				levID=levID+lastNumber;

				}

				strData = strData.slice(strData.indexOf(":")+2);


				//data + level specific
				levelName = strData.slice(0, strData.indexOf('\"'));
				strData = strData.slice(strData.indexOf("percentage"));
				console.log(strData);
				var percentage = strData.slice(12, strData.indexOf(","));
				if(levelCounter==1){
					maindata=addlevel1(maindata, levelName, percentage, levID);
				}
				else{
					strData = strData.slice(strData.indexOf("mark"));
					var mark = strData.slice(6, strData.indexOf(","));

					
					if(levelCounter==2){
						strData = strData.slice(strData.indexOf("maxMark"));
						var maxMark = strData.slice(9, strData.indexOf(","))
						maindata=addlevel2(maindata, levelName, percentage, levID, mark, maxMark);
					}
					if(levelCounter==3){
						strData = strData.slice(strData.indexOf("maxMark"));
						var maxMark = strData.slice(9, strData.indexOf("}"))
						maindata=addlevel3(maindata, levelName, percentage, levID, mark, maxMark);
					}
				}

		}


		else{
			console.log("not corrrect char" + strData.slice(0,1));
		}


		var nextBrace = strData.indexOf("}");
		var nextSquareBracket = strData.indexOf("[");

		if (nextBrace<nextSquareBracket||nextSquareBracket==-1){
			strData = strData.slice(nextBrace);

			maindata = endlevel(maindata);
			if (strData == "}"){
				break;
			}

		}
		
		else {
			strData = strData.slice(nextSquareBracket);
		}



		counter++
		if (counter >29){
			break;
		}
	}
	commitTable(maindata);
})


//top buttons
var buttons = '';
	
getCourses (function(response){
	var courseStrArr =response;
	var courselistStringLength = courseStrArr.length;
	courseStrArr=courseStrArr.slice(1, courselistStringLength-1);
	console.log(courseStrArr);
	console.log(courseStrArr)
	while(courseStrArr!=""){
	    courseStrArr = courseStrArr.slice(1);
	    var nextInvCom = courseStrArr.indexOf("\"");
	    var nextCourseName = courseStrArr.slice(0, nextInvCom);
	    console.log(nextCourseName);
	    buttons = addCourseButton(nextCourseName, buttons);
	    courseStrArr=courseStrArr.slice(nextInvCom + 2);
	}
	console.log(buttons);
	commitButtons(buttons);
});





});

//buttons
function addCourseButton(buttonTitle, buttons){
	buttons +='<button id="but" class="btn navbar-btn btn-secondary">' + buttonTitle + '</button>';
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

function addlevel1(collapseData, turpleName, mark, levelnumber){

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
              mark+ "%" +
            '</span>'+
          '</div>'+
        '</h4>'+
      '</div>'+
      '<div id="collapse'+levelnumber+'" class="collapse" role="tabpanel">';

      return collapseData;
};


function addlevel2(collapseData, turpleName, percentage, levelnumber, mark, maxMark){

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
              '<a class="collapsed" data-toggle="collapse" href="#collapse'+levelnumber+'" aria-expanded="false">'+
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


function getMarks(load){
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