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
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      loggedIn();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
    }
  }

  $("#login").click(function() {
     FB.login(function(response) {
      Log.info('FB.login callback', response);
      if (response.status === 'connected') {
        Log.info('User is logged in');
        addUser(response);
      } else {
        Log.info('User is logged out');
      }
    });
   });

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function loggedIn() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
              addUser(response);
      console.log('Successful login for: ' + response.name);
      $('#status').html('Thanks for signing up, ' + response.first_name + '!');
      $('#login').html('Welcome to the Tribe! <span class="glyphicon glyphicon-ok">').addClass('btn-success');
    });
  }

  function addUser(response) {
    console.log('Adding user to database.... ');
    $.ajax({
      type: 'POST',
      url: 'http://api.ethicalswitch.org/users/',
      data: response,
      dataType: 'json',
      contentType: 'application/x-www-form-urlencoded'
    });
  }

    $("#main").onepage_scroll({
       sectionContainer: "section",
       easing: "ease",

       animationTime: 1000,
       pagination: true,
       updateURL: false,
       beforeMove: function(index) {},
       afterMove: function(index) {},
       loop: false,
       keyboard: true,
       responsiveFallback: false
    });

});