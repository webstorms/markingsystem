//logout?
$(function() {

  $('#logout').on('click', function(e) {
    logout(function(response) {
        if (response == "success") {
          window.location.reload(true); 

        } 

      });

  });

});

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

function createUser(){	
	//invalid ID - error message
	if(idExists()){
		document.getElementById("id_exists").innerHTML = "ID already exists";
	}
	else{
		//valid new ID - add user to DB
		addToDB();
		document.getElementById("id_exists").innerHTML = "";
	}
  	return;
}

function removeUser(){
	//invalid ID - error message
	if(!idExists()){
		document.getElementById("IDExists").innerHTML = "ID does not exist";
	}
	else{
		//valid ID - remove user from DB
		removeFromDB();
		document.getElementById("IDExists").innerHTML = "";
		
	}
  	return;
}

//===============	not implementing for demo ==================
function idExists(){
	return true;
}

function addToDB() {
}

function removeFromDB(){
}
//===============================================================
