
document.addEventListener("DOMContentLoaded", function(event) { 
	$(function() {

	  $('#logout').on('click', function(e) {
	    logout(function(response) {
	        if (response == "success") {
	          window.location.reload(true); 
	        } 
	      });
	  });

		$('#createUser_button').on('click', function(e) {
	  	createUser(function(response) {
				if (response == "userExists") {
					var userExistsMsg = 'user already exists';
					$('#user_exists').html('<small id="user_exists" class="form-text text-danger">'+userExistsMsg+'</small>');
					
	      	} 
				else if(response == "success"){
					$('#user_exists').html('<small id="user_exists" class="form-text text-danger"></small>');
					confirm("Successfully added new user!");
					$('#createUser_form')[0].reset();
				}
	      });
			
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

function createUser(load){
	var data = {
    "userID": $('#createUser_userID').val(),
    "password": $('#createUser_pass').val(),
		"userType": $('#createUser_userType').val()
  }
	 $.ajax({
    url: '/admin_createUser',
    type: 'POST',
		data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(res) {
      load(JSON.parse(res));
    }
  });	

}

function removeUser(){

}


