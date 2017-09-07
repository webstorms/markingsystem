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