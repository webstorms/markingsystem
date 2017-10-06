<!DOCTYPE html>
<html lang="en">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>
  <!-- CSS -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
  <link rel='stylesheet prefetch' href='http://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.1.0/css/font-awesome.min.css'>
  <link href="css/login.css" rel="stylesheet">
  <!-- JS -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
  <script src="js/login.js"></script>
</head>

  <body>

    <div class="container">

      <form class="form-signin">
        <h2 class="form-signin-heading">Login</h2>

        <div id="login_alert"></div>

        <label for="input_username" class="sr-only">User ID</label>
        <input type="text" id="input_username" class="form-control" placeholder="User ID">

        <label for="input_password" class="sr-only">Password</label>
        <input type="password" id="input_password" class="form-control" placeholder="Password">
        
        <button type="button" id="login" class="btn btn-lg btn-primary btn-block" type="submit">Login</button>
      </form>

    </div>
    
  </body>

</html>
