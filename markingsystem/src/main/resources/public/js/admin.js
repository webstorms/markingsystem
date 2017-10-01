
document.addEventListener("DOMContentLoaded", function(event) { 
	$(function() {

	  $('#logout').on('click', function(e) {
	    logout(function(response) {
	        if (response == "success") {
	          window.location.reload(true); 
	        } 
	      });

	    // getCourses(function(response) {
	    //     window.alert(response); 
	    //   });
	    // getMarks(function(response) {
	    //     window.alert(response); 
	    //   });
	    });

		$('#createUser_button').on('click', function(e) {
	  	createUser(function(response) {
				if (response == "userExists") {
					var userExistsMsg = 'user already exists';
					$('#user_exists').html('<small id="user_exists" class="form-text text-danger">'+userExistsMsg+'</small>');
					
	      	} 
				else if(response == "success") {
					$('#user_exists').html('<small id="user_exists" class="form-text text-danger"></small>');
					confirm("Successfully added new user!");
					$('#createUser_form')[0].reset();
				}
	      });
			
	  });

		$('#removeUser_button').on('click', function(e) {
	  	removeUser(function(response) {
				if (response == "userDoesNotExist") {
					var errorMsg = 'No user with that ID exists!';
					$('#removeUser_error').html('<small id="removeUser_error" class="form-text text-danger">'+errorMsg+'</small>');
					
	      	} 
				else if(response == "success"){
					$('#removeUser_error').html('<small id="removeUser_error" class="form-text text-danger"></small>');
					confirm("Successfully removed user!");
					$('#removeUser_form')[0].reset();
				}
	      });
			
	  });

		$('#changePass_button').on('click', function(e) {
	  	changePass(function(response) {
				if (response == "userDoesNotExist") {
					var errorMsg = 'No user with that ID exists!';
					$('#changePass_error').html('<small id="changePass_error" class="form-text text-danger">'+errorMsg+'</small>');
					
	      	} 
				else if(response == "success"){
					$('#changePass_error').html('<small id="changePass_error" class="form-text text-danger"></small>');
					confirm("Password updated!");
					$('#changePass_form')[0].reset();
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

function removeUser(load){
	var data = {
			"userID": $('#removeUser_userID').val(),
		}
		$.ajax({
			url: '/admin_removeUser',
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			success: function(res) {
				load(JSON.parse(res));
			}
		});	
}

function changePass(load){
	var data = {
    "userID": $('#changePass_userID').val(),
    "password": $('#changePass_pass').val(),
  }
	 $.ajax({
    url: '/admin_changePass',
    type: 'POST',
		data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(res) {
      load(JSON.parse(res));
    }
  });	

}

// function getCourses(load){
// 	var data = {
//     "userID": "admin",
//   }
// 	 $.ajax({
//     url: '/getCourses',
//     type: 'POST',
// 		data: JSON.stringify(data),
//     contentType: 'application/json',
//     success: function(res) {
//       load(JSON.parse(res));
//     }
//   });	

// }

// function getMarks(load){
// 	var data = {
//     "userID": "admin",
//     "courseID": "mam100017",
//   }
// 	 $.ajax({
//     url: '/getMarks',
//     type: 'POST',
// 		data: JSON.stringify(data),
//     contentType: 'application/json',
//     success: function(res) {
//       load(JSON.parse(res));
//     }
//   });	
//}

