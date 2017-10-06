
document.addEventListener("DOMContentLoaded", function(event) {
	$(function() {

	  $('#logout-button').on('click', function(e) {
	    logout(function(response) {
	        if (response == "success") {
	           window.location.href = '/';
	        } 
	      });

	    });

		$('#change').on('click', function(e) {
			var newPass = $('#new-password').val()
			var confirmPass = $('#confirm-password').val()
			if(newPass != confirmPass) {
				alert("Passwords do not match.");

			}
			else {
				changePass(newPass, function(response) {
					if(response == "success") {
						confirm("Password updated!");
						
					}
	      		});

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

function changePass(pass, load) {
	var data = {
    "password": pass
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