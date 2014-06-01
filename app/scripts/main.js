$(document).ready(function() {
  $.ajaxSetup({ cache: true });
  $.getScript('//connect.facebook.net/en_UK/all.js', function(){
    FB.init({
      appId: '1427999834129994',
    });
    $('#loginbutton,#feedbutton').removeAttr('disabled');
    FB.getLoginStatus(updateStatusCallback);
  });

  function updateStatusCallback(response) {
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      console.log('Welcome!  Fetching your information.... ');
      FB.api('/me', function(response) {
        addUser(response);
        console.log('Successful login for: ' + response.name);
        $('#status').html('Thanks for signing up, ' + response.first_name + '!');
        $('#login').html('Welcome to the Tribe! <span class="glyphicon glyphicon-ok">').addClass('btn-success');
      });
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      $('#status').html('');
      $('#login').html('Sign up with Facebook <span class="glyphicon glyphicon-user">').removeClass('btn-success').addClass('btn-primary');
    }
  }

  $("#login").click(function() {
     FB.login(function(response) {
      if (response.status === 'connected') {
        addUser(response);
        updateStatusCallback(response);
      } else {
        Log.info('User is logged out');
      }
    });
   });

  $("#logout").click(function() {
    FB.logout(function(response) {
      updateStatusCallback(response);
    });
  });

  $("#sign-up-button").click(function() {
    firstName =  $('#first-name').val();
    lastName = $('#last-name').val();
    email = $('#email').val();
    if (firstName && lastName && email) {
      $('#sign-up-error').hide();
      addUser({first_name: firstName, last_name: lastName, email: email});
      $('#display-first-name').text(firstName);
      $('#sign-up-success').show();
      $('#first-name').val('');
      $('#last-name').val('');
      $('#email').val('');
    }
    else {
      $('#sign-up-success').hide();
      $('#sign-up-error').show();
    }
  });

  function getUserCount() {
    $.get( "http://api.ethicalswitch.org/users/count/", function(data) {
      console.log(data);
      $( "#user-count span" ).html(data);
    });
  }

  function addUser(response) {
    console.log('Adding user to database.... ');
    $.ajax({
      type: 'POST',
      url: 'http://api.ethicalswitch.org/users/',
      data: response,
      dataType: 'json',
      contentType: 'application/x-www-form-urlencoded',
      success: updateUserCount
    });
  }

  function updateUserCount() {
    $.get( "http://api.ethicalswitch.org/users/count/", function(data) {
      $('#user-count span').text(data);
    });
  }

  function getUserCount() {
    $.get( "http://api.ethicalswitch.org/users/count/", function(data) {
      $('#user-count span').animateNumber({ number: data });
    });
  }

  $("#main").onepage_scroll({
      sectionContainer: "section",
      easing: "ease",
      animationTime: 1000,
      pagination: true,
      updateURL: true,
      beforeMove: function(index) {},
      afterMove: function(index) {},
      loop: false,
      keyboard: true,
      responsiveFallback: false
  });

  $(document).ready(function() {
    getUserCount();
    $("#main").moveTo(1);
  });

});
