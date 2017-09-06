$(function() {

  $('#login').on('click', function(e) {

    // Check has content
    if($('#input_username').val() == '' || $('#input_password').val() == '') {
      var alert = 'Please provide a user ID and password';
      $('#login_alert').html('<div class="alert alert-danger"role="alert"><p class="text-center">' + alert + '</p></div>');
      return;

    }

    login(function(response) {
        if (response == "success") {
          window.location.reload(true);

        } 
        else {
          $('#login_alert').html('<div class="alert alert-danger"role="alert"><p class="text-center">' + response + '</p></div>');

        }

      });

  });

});

function login(load) {
  var data = {
    "username": $('#input_username').val(),
    "password": $('#input_password').val()
  }
  $.ajax({
    url: '/login',
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(res) {
      load(JSON.parse(res));
    }
  });
}